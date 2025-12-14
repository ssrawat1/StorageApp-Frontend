const TermsOfService = () => {
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

  const termsOfServiceMarkdown = `# Terms of Service

**Last Updated: December 2025**

These Terms of Service ("Agreement") govern your use of SafeMyStuff ("Service") and are entered into between you ("User," "you," or "your") and SafeMyStuff ("Company," "we," "us," or "our").

By accessing and using SafeMyStuff, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.

## 1. Service Description

SafeMyStuff is a cloud storage platform that allows users to:
- Upload, store, and manage files securely
- Organize files in folders
- Access files from multiple devices
- Subscribe to premium storage plans

## 2. User Accounts

### 2.1 Account Creation
- You may create an account using your Google account
- You are responsible for maintaining the confidentiality of your account credentials
- You agree to provide accurate and truthful information during authentication
- You are responsible for all activities that occur under your account

### 2.2 Account Eligibility
- You must be at least 18 years old or have parental consent
- You agree to use SafeMyStuff only for lawful purposes
- You may not use the Service if prohibited by applicable laws in your jurisdiction

### 2.3 Account Termination
We reserve the right to suspend or terminate your account if:
- You violate these Terms of Service
- You engage in fraudulent or illegal activities
- You violate intellectual property rights
- Your account shows signs of unauthorized access
- You fail to pay subscription fees

## 3. Acceptable Use Policy

You agree NOT to:

### 3.1 Prohibited Content
- Upload, store, or share illegal content, including child exploitation material
- Upload content that violates intellectual property rights (copyrights, trademarks, patents)
- Store content related to terrorism, violence, or hate speech
- Upload malware, viruses, or harmful code
- Use the Service for phishing, hacking, or unauthorized access attempts

### 3.2 Prohibited Activities
- Attempt to gain unauthorized access to our systems or other users' accounts
- Interfere with or disrupt the Service or its infrastructure
- Use automated tools to access the Service without authorization
- Reverse engineer, decompile, or attempt to discover source code
- Attempt to circumvent security measures
- Use the Service to spam or harass other users

### 3.3 Commercial Use Restrictions
- You may not use SafeMyStuff for commercial hosting or file distribution
- You may not sell or resell access to the Service
- Personal and business use for your own organization is permitted

## 4. Intellectual Property Rights

### 4.1 Your Content
- You retain all intellectual property rights to files you upload
- By uploading content, you grant us a limited license to store, process, and deliver your files
- You represent and warrant that you own or have permission to use all uploaded content

### 4.2 Company Content
- The SafeMyStuff platform, interface, and documentation are owned by the Company
- All trademarks, logos, and branding are protected
- You may not reproduce, modify, or distribute Company content without permission

## 5. File Storage and Management

### 5.1 Storage Limits
- Free accounts receive limited storage
- Premium subscriptions include additional storage
- We reserve the right to enforce storage limits
- Users exceeding limits may have upload capabilities restricted

### 5.2 File Retention
- Files remain on our servers as long as your account is active
- When you delete files, they are permanently removed from our servers
- Deleted files cannot be recovered
- We maintain backups for security purposes, but deleted files are not recoverable by users

### 5.3 File Scanning
- We reserve the right to scan files for viruses and malware
- We reserve the right to remove files that violate this Agreement
- We do not intentionally access or monitor file contents beyond security scanning

## 6. Data Security

### 6.1 Security Measures
- Files are encrypted in transit using HTTPS
- Files are encrypted at rest using AWS S3 server-side encryption
- We implement industry-standard security practices
- No system is completely secure; we cannot guarantee absolute security

### 6.2 User Responsibility
- You are responsible for securing your account credentials
- Do not share your login information with others
- We are not liable for unauthorized access due to your negligence

### 6.3 Encryption Notice
- Files are not end-to-end encrypted
- Our servers can access file contents for security, compliance, or operational purposes
- If you require maximum privacy, you may encrypt files before uploading

## 7. Subscription and Payments

### 7.1 Subscription Plans
- SafeMyStuff offers free and paid subscription tiers
- Paid plans require a valid payment method
- Subscription fees are charged according to the selected plan

### 7.2 Billing
- Payments are processed through Razorpay
- Your payment information is handled securely by Razorpay
- We are not responsible for payment processing errors by Razorpay
- Billing occurs on a recurring basis as specified in your subscription

### 7.3 Cancellation
- You may cancel your subscription at any time
- Cancellation takes effect at the end of your current billing cycle
- No refunds are provided for partial months
- Upon cancellation, you lose access to premium features but may download your data

### 7.4 Price Changes
- We reserve the right to change subscription prices
- Price changes will be communicated 30 days in advance
- Continued use of the Service after a price change constitutes acceptance

## 8. Limitation of Liability

### 8.1 Disclaimer
SafeMyStuff is provided "AS IS" without warranties of any kind, either express or implied. We do not guarantee:
- The Service will be uninterrupted or error-free
- All files will be accessible or recoverable
- The Service is suitable for your specific needs

### 8.2 Liability Limits
To the maximum extent permitted by law:
- We are not liable for indirect, incidental, special, or consequential damages
- Our total liability shall not exceed the amount you paid for the Service in the past 12 months
- We are not liable for loss of data, business, or profits due to Service interruptions

### 8.3 Your Responsibility
- You assume all risks associated with using SafeMyStuff
- You are responsible for backing up important data
- We recommend maintaining copies of critical files outside SafeMyStuff

## 9. Indemnification

You agree to indemnify and hold harmless SafeMyStuff from any claims, damages, or losses arising from:
- Your use of the Service in violation of these Terms
- Your violation of applicable laws
- Your infringement of third-party rights
- Any content you upload or actions you take using the Service

## 10. Service Availability

### 10.1 Uptime
- We strive to maintain 99% service availability
- We perform maintenance that may cause temporary service interruptions
- We are not liable for downtime or service interruptions

### 10.2 Service Modifications
- We reserve the right to modify, suspend, or discontinue features
- We will provide reasonable notice of major changes
- We are not liable for loss resulting from service modifications

## 11. Privacy and Data Protection

Your use of SafeMyStuff is governed by our Privacy Policy. Please review it to understand our data practices.

## 12. Governing Law

These Terms of Service are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in India.

## 13. Dispute Resolution

### 13.1 Informal Resolution
Before taking legal action, you agree to attempt to resolve disputes through good-faith negotiation with our support team.

### 13.2 Legal Action
If disputes cannot be resolved informally, both parties agree to submit to the jurisdiction of Indian courts.

## 14. Severability

If any provision of these Terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.

## 15. Entire Agreement

These Terms of Service, along with the Privacy Policy, constitute the entire agreement between you and SafeMyStuff regarding your use of the Service.

## 16. Changes to Terms

We may modify these Terms of Service periodically. Changes will be posted on this page with an updated "Last Updated" date. Your continued use of SafeMyStuff constitutes acceptance of the updated terms.

## 17. Contact Information

For questions about these Terms of Service, please contact us at:

**Email:** ssr911999@gmail.com

**Website:** https://safemystuff.store

---

**By using SafeMyStuff, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.**`;

  const html = markdownToHtml(termsOfServiceMarkdown);

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

export default TermsOfService;