# Service Implementation Guide

## Table of Contents

- [Introduction](#introduction)
- [API Architecture](#api-architecture)
- [Service Layer Implementation](#service-layer-implementation)
- [Authentication Flow](#authentication-flow)
- [Transactional API Services](#transactional-api-services)
- [Event-Based API Services](#event-based-api-services)
- [Notification Services](#notification-services)
- [Best Practices](#best-practices)
- [Testing Strategies](#testing-strategies)

## Introduction

This guide outlines how to replace mock interfaces with real API services in our React/TypeScript application. It provides implementation details for various service types including transactional data, event-based services, and notification systems.

## API Architecture

### Directory Structure

```text
src/
  services/
    api/
      config.ts            # Base API configuration
      interceptors.ts      # Request/response interceptors
    auth/
      index.ts             # Authentication services
      types.ts             # Auth-related types
    transaction/
      index.ts             # Transactional services
      types.ts             # Transaction-related types
    events/
      index.ts             # Event-based services
      types.ts             # Event-related types
    notifications/
      index.ts             # Notification services
      types.ts             # Notification-related types
    index.ts               # Service exports
  hooks/
    api/                   # React Query hooks
      useAuth.ts
      useTransaction.ts
      useEvents.ts
      useNotifications.ts
```

### Design Principles

1. **Separation of Concerns**: API services should be separate from UI components
2. **Type Safety**: Use TypeScript interfaces for all API requests and responses
3. **Error Handling**: Consistent error handling across all services
4. **Caching Strategy**: Implement appropriate caching using React Query
5. **Testing**: All services should be testable in isolation

## Service Layer Implementation

### Base API Client

Create a base API client using Axios:

```typescript
// src/services/api/config.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Environment-specific API URL
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Default config for axios
const axiosConfig: AxiosRequestConfig = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
};

// Create axios instance
const apiClient: AxiosInstance = axios.create(axiosConfig);

export default apiClient;
```

### Interceptors

Add request/response interceptors for authentication and error handling:

```typescript
// src/services/api/interceptors.ts
import { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { refreshTokenService } from '../auth';

export const setupInterceptors = (api: AxiosInstance): AxiosInstance => {
  // Request interceptor - add auth token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle errors & token refresh
  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      
      // Handle 401 Unauthorized - attempt token refresh
      if (error.response?.status === 401 && !originalRequest.headers['x-retry']) {
        try {
          // Try to refresh the token
          const newToken = await refreshTokenService();
          
          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          originalRequest.headers['x-retry'] = 'true';
          
          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
      
      return Promise.reject(error);
    }
  );

  return api;
};
```

## Authentication Flow

### Authentication Service

```typescript
// src/services/auth/types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
```

```typescript
// src/services/auth/index.ts
import apiClient from '../api/config';
import { LoginCredentials, AuthResponse, RefreshTokenResponse } from './types';

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    // Store tokens
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    return data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },

  // Refresh token
  refreshToken: async (): Promise<string> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const { data } = await apiClient.post<RefreshTokenResponse>(
      '/auth/refresh',
      { refreshToken }
    );

    localStorage.setItem('access_token', data.accessToken);
    return data.accessToken;
  },
};

// Exported for use in interceptors
export const refreshTokenService = authService.refreshToken;
```

### Authentication Hooks with React Query

```typescript
// src/hooks/api/useAuth.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/auth';
import { LoginCredentials, User } from '../../services/auth/types';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Update current user in cache
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear user from cache
      queryClient.setQueryData(['currentUser'], null);
      // Invalidate all queries
      queryClient.invalidateQueries();
    },
  });
};
```

## Transactional API Services

Transactional APIs handle CRUD operations and data management.

### User Management Service (Example)

```typescript
// src/services/transaction/types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
  dateCreated: string;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  role: string;
  status: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: string;
  status?: string;
}
```

```typescript
// src/services/transaction/index.ts
import apiClient from '../api/config';
import {
  User,
  UserFilters,
  CreateUserDTO,
  UpdateUserDTO,
  PaginatedResponse
} from './types';

export const userService = {
  // Get users with pagination and filtering
  getUsers: async (filters?: UserFilters): Promise<PaginatedResponse<User>> => {
    const { data } = await apiClient.get<PaginatedResponse<User>>('/users', {
      params: filters,
    });
    return data;
  },
  
  // Get a single user by ID
  getUserById: async (id: number): Promise<User> => {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },
  
  // Create a new user
  createUser: async (user: CreateUserDTO): Promise<User> => {
    const { data } = await apiClient.post<User>('/users', user);
    return data;
  },
  
  // Update an existing user
  updateUser: async (id: number, user: UpdateUserDTO): Promise<User> => {
    const { data } = await apiClient.put<User>(`/users/${id}`, user);
    return data;
  },
  
  // Delete a user
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  }
};

// Export all transactional services
export const transactionServices = {
  users: userService,
  // Add other transaction services here
};
```

### React Query Hooks for Transactional Data

```typescript
// src/hooks/api/useTransaction.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/transaction';
import {
  User,
  UserFilters,
  CreateUserDTO,
  UpdateUserDTO,
  PaginatedResponse
} from '../../services/transaction/types';

// User list with pagination and filtering
export const useUsers = (filters: UserFilters = {}) => {
  return useQuery<PaginatedResponse<User>>({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers(filters),
    keepPreviousData: true, // Keep previous data while fetching new data
  });
};

// Single user by ID
export const useUser = (id: number) => {
  return useQuery<User>({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id),
    enabled: !!id, // Only run if ID is provided
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newUser: CreateUserDTO) => userService.createUser(newUser),
    onSuccess: () => {
      // Invalidate users list query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDTO }) => 
      userService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update cache for this specific user
      queryClient.setQueryData(['user', updatedUser.id], updatedUser);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['user', id] });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

## Event-Based API Services

Event-based APIs handle real-time data and events from the server.

### Event Service

```typescript
// src/services/events/types.ts
export type EventType = 'task_created' | 'task_updated' | 'task_deleted' | 'user_activity';

export interface EventPayload {
  id: string;
  type: EventType;
  data: any;
  timestamp: string;
}

export interface EventFilter {
  types?: EventType[];
  since?: string;
}

export interface EventSubscription {
  unsubscribe: () => void;
}
```

```typescript
// src/services/events/index.ts
import apiClient from '../api/config';
import { EventFilter, EventPayload, EventSubscription, EventType } from './types';

// WebSocket connection for real-time events
let socket: WebSocket | null = null;
const subscribers = new Map<string, (event: EventPayload) => void>();

const connectWebSocket = (): Promise<WebSocket> => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('access_token');
    const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/events?token=${token}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      socket = ws;
      resolve(ws);
    };
    
    ws.onerror = (error) => {
      reject(error);
    };
    
    ws.onmessage = (message) => {
      try {
        const event: EventPayload = JSON.parse(message.data);
        // Notify all subscribers interested in this event type
        subscribers.forEach((callback) => {
          callback(event);
        });
      } catch (error) {
        console.error('Error parsing event:', error);
      }
    };
    
    ws.onclose = () => {
      socket = null;
      // Attempt to reconnect after a delay
      setTimeout(() => {
        connectWebSocket().catch(console.error);
      }, 5000);
    };
  });
};

export const eventService = {
  // Get historical events
  getEvents: async (filter?: EventFilter): Promise<EventPayload[]> => {
    const { data } = await apiClient.get<EventPayload[]>('/events', {
      params: filter,
    });
    return data;
  },
  
  // Subscribe to real-time events
  subscribeToEvents: async (
    callback: (event: EventPayload) => void,
    types?: EventType[]
  ): Promise<EventSubscription> => {
    const subscriptionId = Date.now().toString();
    
    // Store callback with subscription ID
    subscribers.set(subscriptionId, (event: EventPayload) => {
      // Filter by event types if specified
      if (!types || types.includes(event.type)) {
        callback(event);
      }
    });
    
    // Ensure WebSocket is connected
    if (!socket) {
      await connectWebSocket();
    }
    
    // Return unsubscribe function
    return {
      unsubscribe: () => {
        subscribers.delete(subscriptionId);
      },
    };
  },
  
  // Disconnect WebSocket
  disconnect: () => {
    if (socket) {
      socket.close();
      socket = null;
    }
    // Clear all subscribers
    subscribers.clear();
  },
};
```

### React Hooks for Event Services

```typescript
// src/hooks/api/useEvents.ts
import { useQuery, useEffect } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { eventService } from '../../services/events';
import { EventFilter, EventPayload, EventType } from '../../services/events/types';

// Hook for historical events
export const useEvents = (filter?: EventFilter) => {
  return useQuery({
    queryKey: ['events', filter],
    queryFn: () => eventService.getEvents(filter),
    refetchInterval: false,
  });
};

// Hook for real-time events
export const useEventSubscription = (types?: EventType[]) => {
  const [events, setEvents] = useState<EventPayload[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Add new event to state
  const handleEvent = useCallback((event: EventPayload) => {
    setEvents((prevEvents) => [event, ...prevEvents]);
  }, []);
  
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    
    const subscribe = async () => {
      try {
        subscription = await eventService.subscribeToEvents(handleEvent, types);
        setIsConnected(true);
        setError(null);
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err : new Error('Failed to connect to event service'));
      }
    };
    
    subscribe();
    
    // Cleanup on unmount
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [handleEvent, types]);
  
  return { events, isConnected, error };
};
```

## Notification Services

Notification services handle alerts, toasts, and in-app message delivery to users.

### Notification Service

```typescript
// src/services/notifications/types.ts
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface NotificationFilter {
  read?: boolean;
  type?: NotificationType;
  limit?: number;
}
```

```typescript
// src/services/notifications/index.ts
import apiClient from '../api/config';
import { eventService } from '../events';
import { Notification, NotificationFilter } from './types';

export const notificationService = {
  // Get user notifications
  getNotifications: async (filter?: NotificationFilter): Promise<Notification[]> => {
    const { data } = await apiClient.get<Notification[]>('/notifications', {
      params: filter,
    });
    return data;
  },
  
  // Mark notification as read
  markAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },
  
  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/read-all');
  },
  
  // Delete a notification
  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },
  
  // Subscribe to real-time notifications using event service
  subscribeToNotifications: async (
    callback: (notification: Notification) => void
  ) => {
    return eventService.subscribeToEvents((event) => {
      if (event.type === 'notification_created') {
        callback(event.data);
      }
    }, ['notification_created']);
  },
};
```

### Notification Context and Hooks

```typescript
// src/contexts/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Notification } from '../services/notifications/types';
import { notificationService } from '../services/notifications';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showToast: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Notification[]>([]);
  const queryClient = useQueryClient();
  
  // Fetch notifications from API
  const { data: apiNotifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => notificationService.getNotifications(),
    refetchInterval: 60000, // Refetch every minute
  });
  
  // Combine API notifications with local toasts
  const notifications = [...toasts, ...apiNotifications];
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Subscribe to real-time notifications
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;
    
    const subscribe = async () => {
      subscription = await notificationService.subscribeToNotifications((notification) => {
        // Add to local state temporarily
        setToasts(prev => [notification, ...prev]);
        
        // Refetch notifications from API
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        
        // Remove from local state after refetch
        setTimeout(() => {
          setToasts(prev => prev.filter(n => n.id !== notification.id));
        }, 1000);
      });
    };
    
    subscribe();
    
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [queryClient]);
  
  // Mark notification as read
  const markAsRead = async (id: string) => {
    await notificationService.markAsRead(id);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };
  
  // Show temporary toast notification (client-side only)
  const showToast = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newToast: Notification = {
      ...notification,
      id: `local-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    
    setToasts(prev => [newToast, ...prev]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        showToast, 
        markAsRead, 
        markAllAsRead 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
```

### Notification Components

```tsx
// src/components/common/Notifications.tsx
import React from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { BellIcon, CheckIcon } from 'lucide-react';

export const NotificationBadge: React.FC = () => {
  const { unreadCount } = useNotifications();
  
  return (
    <div className="relative">
      <BellIcon size={20} />
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          {unreadCount > 9 ? '9+' : unreadCount}
        </div>
      )}
    </div>
  );
};

export const NotificationList: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  
  if (notifications.length === 0) {
    return <div className="p-4 text-center text-gray-500">No notifications</div>;
  }
  
  return (
    <div className="max-h-96 overflow-y-auto">
      <div className="p-2 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">Notifications</h3>
        <button
          onClick={() => markAllAsRead()}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Mark all as read
        </button>
      </div>
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-3 border-b border-gray-100 ${
              notification.read ? 'bg-white' : 'bg-blue-50'
            }`}
          >
            <div className="flex justify-between">
              <div>
                {notification.title && (
                  <h4 className="font-medium">{notification.title}</h4>
                )}
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <CheckIcon size={16} />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { notifications } = useNotifications();
  const toasts = notifications.filter(n => n.id.startsWith('local-'));
  
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3 rounded-md shadow-lg max-w-xs animate-fade-in ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            toast.type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
          }`}
        >
          {toast.title && <h4 className="font-medium">{toast.title}</h4>}
          <p className="text-sm">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};
```

## Best Practices

### API Service Design

1. **Type everything**: Define TypeScript interfaces for all API requests and responses
2. **Handle errors properly**: Implement error handling at service level
3. **Be consistent**: Use similar patterns across all services
4. **Single responsibility**: Each service should have a clear purpose
5. **Avoid duplication**: Reuse types and functionality where appropriate

### Authentication

1. **Secure token storage**: Use secure methods for storing tokens
2. **Token refresh flow**: Implement automatic token refresh
3. **Logout on unauthorized**: Redirect to login on authentication failures
4. **Role-based access**: Implement permission checks
5. **JWT validation**: Validate tokens on client side

### Performance

1. **Caching**: Use React Query's caching features
2. **Optimistic updates**: Update UI before API calls complete
3. **Request deduplication**: Avoid duplicate requests
4. **Batching**: Batch requests where possible
5. **Throttling**: Implement API call throttling

### Error Handling

1. **Consistent format**: Use consistent error format across services
2. **User-friendly messages**: Transform API errors to user-friendly messages
3. **Retry strategy**: Implement retry for transient errors
4. **Fallback UI**: Provide fallback UI for failed requests
5. **Error boundaries**: Use React error boundaries

## Testing Strategies

### Unit Testing

1. **Mock axios**: Use axios-mock-adapter for testing API calls
2. **Test all services**: Write unit tests for all service methods
3. **Test error handling**: Ensure error paths are tested
4. **Test interceptors**: Verify interceptors work correctly

### Integration Testing

1. **Test with React Query**: Test hooks with React Query
2. **MSW for mocking**: Use Mock Service Worker for API mocking
3. **Test authentication flow**: Verify login, logout, and token refresh
4. **Test event handling**: Verify event subscriptions and handling

### End-to-End Testing

1. **Test critical flows**: Ensure critical flows work end-to-end
2. **API fallbacks**: Test with API failures
3. **Realistic scenarios**: Test realistic user scenarios

## References

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
