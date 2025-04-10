import React, { useState } from 'react';
// ... other imports ...
import { DocumentPreview } from '../common/DocumentPreview';
// Inside CompanyProfile component, add new state:
const [selectedDocument, setSelectedDocument] = useState<{
  name: string;
  url: string;
} | null>(null) <
// Find the documents section in the JSX and update the view button:
button;
onClick = {}();
setSelectedDocument({
  name: doc.name,
  url: ''
});
className = 'text-blue-600 hover:text-blue-800 text-sm' > View;
button > {
  /* Add at the end of the component, before the closing div */
};
{
  selectedDocument && <DocumentPreview name={selectedDocument.name} url={selectedDocument.url} onClose={() => setSelectedDocument(null)} />;
}