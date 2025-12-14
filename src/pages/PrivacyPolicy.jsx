const PrivacyPolicy = () => {
  const markdownToHtml = (md) => {
    let html = md;
    
    html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>');
    
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    html = html.replace(/^\- (.*?)$/gm, '<li class="ml-6 mb-1">$1</li>');
    html = html.replace(/(<li.*?<\/li>)/s, '<ul class="list-disc mb-3">$1</ul>');
    html = html.replace(/<\/ul>\s*<ul/g, '');
    
    html = html.replace(/\n\n/g, '</p><p class="mb-3">');
    html = '<p class="mb-3">' + html + '</p>';
    
    html = html.replace(/^---$/gm, '<hr class="my-6 border-slate-300" />');
    
    return html;
  };

  const privacyPolicyMarkdown = `# Privacy Policy

**Last Updated: December 2025**

SafeMyStuff ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our cloud storage service.

## 1. Information We Collect

We collect the following information from you when you use SafeMyStuff:

### 1.1 Information from Google Authentication
When you sign in using your Google account, we collect and store:
- Your name
- Your email address
- Your profile picture
- Your Google account ID (sub)
- Your Google account issuer information (iss)

### 1.2 File and Metadata Information
When you upload files to SafeMyStuff:
- File names, sizes, and types
- File upload and modification dates
- Folder structure and organization information
- File metadata necessary for storage and retrieval

### 1.3 Payment Information
When you subscribe to our paid plans:
- Payment information is processed through Razorpay
- We do not directly store credit card or banking details
- Razorpay processes and securely stores payment credentials according to PCI-DSS standards

### 1.4 Usage Information
- Account activity logs (file uploads, downloads, deletions)
- Access timestamps and IP addresses
- User preferences and settings

## 2. How We Use Your Information

We use the collected information for the following purposes:

- To authenticate your identity and manage your account
- To store, retrieve, and manage your files securely
- To process subscription payments and manage billing
- To provide customer support and respond to inquiries
- To improve our service quality and user experience
- To maintain security and prevent fraud
- To comply with legal obligations

## 3. Data Storage and Security

### 3.1 File Storage
- Your files are stored in Amazon Web Services (AWS) S3 buckets
- Files are encrypted at rest using AWS S3 server-side encryption
- Files are encrypted in transit using HTTPS/TLS protocols
- Your metadata is securely stored in our database

### 3.2 Security Measures
- We implement industry-standard security measures to protect your information
- Data is protected during transmission using HTTPS encryption
- AWS S3 provides server-side encryption for stored files
- Access to your data is controlled through secure authentication

### 3.3 Note on Encryption
Files uploaded to SafeMyStuff are not end-to-end encrypted. This means our servers can access file contents. However, we maintain strict security protocols and only access your files when necessary to provide our services.

## 4. Data Retention and Deletion

### 4.1 Active Accounts
We retain your account information as long as your account remains active.

### 4.2 File Deletion
When you delete files or folders from SafeMyStuff:
- The files are permanently removed from AWS S3
- The associated metadata is deleted from our database
- Deletion is recursive for nested folders and their contents
- Deleted data cannot be recovered

### 4.3 Account Deletion
If you delete your account, we will:
- Remove your account information from our database
- Delete all associated files from AWS S3
- Remove all metadata linked to your account
- Retain minimal information as required by law

## 5. Data Sharing

We do not share, sell, or disclose your personal information or files to third parties, except:
- With Razorpay for payment processing (limited to payment-related data)
- With AWS for file storage services (files stored in encrypted form)
- When required by law, court order, or government request
- To protect our legal rights or prevent fraud

## 6. Third-Party Services

### 6.1 Google Authentication
Your authentication is handled through Google. Please review Google's Privacy Policy for information about how they handle your data.

### 6.2 AWS S3
Your files are stored on AWS infrastructure. AWS maintains its own security and privacy practices. Visit AWS Privacy Notice for more details.

### 6.3 Razorpay
Payment processing is handled by Razorpay. Review Razorpay's Privacy Policy for information about payment data handling.

## 7. User Rights

You have the right to:
- Access your personal information
- Correct inaccurate information
- Delete your account and associated data
- Download your files
- Understand how your data is being used

To exercise these rights, contact us at ssr911999@gmail.com

## 8. Data Protection

We comply with applicable data protection laws and regulations. Our security practices include:
- Secure authentication using industry-standard protocols
- Regular security audits and updates
- Limited access to user data within our organization
- Monitoring for unauthorized access attempts

## 9. Changes to This Privacy Policy

We may update this Privacy Policy periodically. Changes will be posted on this page with an updated "Last Updated" date. Continued use of SafeMyStuff constitutes acceptance of the updated policy.

## 10. Contact Us

If you have questions about this Privacy Policy or our privacy practices, please contact us at:

**Email:** ssr911999@gmail.com

**Website:** https://safemystuff.store

---

By using SafeMyStuff, you acknowledge that you have read and understood this Privacy Policy.`;

  const html = markdownToHtml(privacyPolicyMarkdown);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div
            className="text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div className="mt-12 text-center text-slate-600 text-sm">
          <p>Questions? Contact us at ssr911999@gmail.com</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;