# Next.js Invoice Dashboard

A modern, responsive invoice management dashboard built with Next.js, featuring a powerful data table with advanced filtering, pagination, and sorting capabilities.

## Features

- 📊 Advanced Data Table
  - Pagination with 25 records per page
  - Column visibility toggle
  - Row selection with checkboxes
  - Sorting capabilities
  - Responsive design

- 🔍 Comprehensive Filtering System
  - Search by payer name and invoice number
  - Status filters (Paid, Awaiting Payment, Draft, Overdue)
  - Date range filters (Today, This Week, This Month, Last Month, This Year)
  - Amount range filters (Under $1,000, $1,000-$5,000, etc.)
  - Visual filter badges
  - Clear filter functionality

- 💫 Modern UI/UX
  - Clean, professional design
  - Row hover states
  - Loading states with skeletons
  - Responsive layout
  - Accessible components

- 📤 Export Functionality
  - Export to CSV
  - Bulk actions support

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tanstack Table](https://tanstack.com/table/v8)
- [React Query](https://tanstack.com/query/latest)
- [date-fns](https://date-fns.org/)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   └── invoices/       # Invoices page component
├── components/         # Reusable components
│   └── ui/            # UI components
├── columns/           # Table column definitions
├── types/            # TypeScript types
└── lib/             # Utility functions
```

## API Integration

The dashboard connects to the Ascend API for invoice data. You'll need to set up your API credentials in your environment variables:

```env
NEXT_PUBLIC_API_URL=your_api_url
```

## Contributing

Feel free to contribute to this project by submitting issues and/or pull requests.

## License

MIT License - feel free to use this in your own projects!