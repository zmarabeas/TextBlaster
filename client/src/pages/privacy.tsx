import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-8">TextBlaster CRM - Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-8"><strong>Last Updated: April 27, 2025</strong></p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Introduction</h2>
          <p className="text-muted-foreground mb-4">
            Better in Binary ("Company," "we," "us," or "our") respects your privacy and is committed to protecting it through our compliance with this Privacy Policy ("Policy").
          </p>
          <p className="text-muted-foreground mb-4">
            This Policy describes how we collect, use, disclose, and protect the personal information we collect when you use our TextBlaster CRM service ("Service"), and your choices regarding our collection and use of your information.
          </p>
          <p className="text-muted-foreground mb-4">
            By accessing or using our Service, you agree to this Privacy Policy. If you do not agree with our policies and practices, do not use our Service.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Information We Collect</h2>
          <p className="text-muted-foreground mb-4">
            We collect several types of information from and about users of our Service, including:
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Information You Provide to Us</h3>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Account Information</strong>: Information you provide when you register for an account, such as your name, email address, phone number, company information, and login credentials.</li>
            <li><strong>Billing Information</strong>: Payment details, billing address, and other information necessary to process your payments.</li>
            <li><strong>Client Information</strong>: Information about your clients that you input into the Service, including names, contact information, communication history, and any notes or tags you create.</li>
            <li><strong>Message Content</strong>: The content of messages you create and send using our Service.</li>
            <li><strong>Communications</strong>: Records of your communications with us, including customer support requests and feedback.</li>
          </ol>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Information We Collect Automatically</h3>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Usage Information</strong>: Details of your visits to our Service, including traffic data, location data, logs, and other communication data and the resources that you access and use on the Service.</li>
            <li><strong>Device Information</strong>: Information about your computer, mobile device, and internet connection, including your IP address, operating system, browser type, and device identifiers.</li>
            <li><strong>Cookies and Similar Technologies</strong>: We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We use the information we collect about you or that you provide to us for the following purposes:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>To provide our Service</strong>: To present our Service and its contents to you, including facilitating client communications and relationship management.</li>
            <li><strong>To manage your account</strong>: To create and maintain your account, process payments, and provide you with customer support.</li>
            <li><strong>To improve our Service</strong>: To understand how users access and use our Service, to develop new features, and to improve user experience.</li>
            <li><strong>To communicate with you</strong>: To contact you about your account, provide support, respond to inquiries, and send administrative messages, updates, security alerts, and other information.</li>
            <li><strong>For analytics and research</strong>: To generate statistical data and improve our Service based on user behavior and preferences.</li>
            <li><strong>To enforce our terms</strong>: To enforce our Terms of Use and for compliance purposes, including to comply with legal obligations.</li>
            <li><strong>For marketing purposes</strong>: To provide you with news, special offers, and general information about other goods, services, and events which we offer, unless you have opted not to receive such information.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Message Delivery and Third-Party Service Providers</h2>
          
          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">Twilio Integration</h3>
          <p className="text-muted-foreground mb-4">
            Our Service uses Twilio to facilitate the delivery of text messages. When you use our messaging features:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>Your message content and recipient information are transmitted to Twilio for message delivery.</li>
            <li>Twilio collects and processes this information in accordance with their privacy policy (available at https://www.twilio.com/legal/privacy).</li>
            <li>Message metadata, including delivery status, is collected and stored to provide delivery confirmation and analytics.</li>
            <li>In compliance with telecommunications regulations, certain data about message transmission is logged and retained.</li>
          </ol>
          
          <p className="text-muted-foreground mb-4">You acknowledge that:</p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>Twilio may monitor message content to detect spam, fraudulent activity, and violations of their Acceptable Use Policy.</li>
            <li>We maintain records of message content and delivery information as required by applicable laws and regulations.</li>
            <li>Neither we nor Twilio can guarantee the security of message content during transmission over cellular networks.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Share Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We may disclose personal information that we collect or you provide as described in this Policy:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Service Providers</strong>: To contractors, service providers, and other third parties we use to support our business (including Twilio for message delivery) and who are bound by contractual obligations to keep personal information confidential and use it only for the purposes for which we disclose it to them.</li>
            <li><strong>Business Transfers</strong>: In connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            <li><strong>Legal Requirements</strong>: To comply with any court order, law, or legal process, including to respond to any government or regulatory request.</li>
            <li><strong>Enforcement</strong>: To enforce or apply our Terms of Use and other agreements, including for billing and collection purposes.</li>
            <li><strong>Protection</strong>: To protect the rights, property, or safety of our Company, our customers, or others.</li>
          </ol>
          <p className="text-muted-foreground mb-4">
            We do not sell, rent, or lease your personal information to third parties.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure. All information you provide to us is stored on secure servers behind firewalls.
          </p>
          <p className="text-muted-foreground mb-4">
            The safety and security of your information also depends on you. Where we have given you (or where you have chosen) a password for access to certain parts of our Service, you are responsible for keeping this password confidential. We ask you not to share your password with anyone.
          </p>
          <p className="text-muted-foreground mb-4">
            Unfortunately, the transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of your personal information transmitted to our Service. Any transmission of personal information is at your own risk.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data Retention</h2>
          <p className="text-muted-foreground mb-4">
            We will retain your personal information for as long as your account is active or as needed to provide you the Service. We will also retain and use your personal information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
          </p>
          <p className="text-muted-foreground mb-4">
            For client contact information and messaging records, we maintain this data for the duration of your service with us, plus any additional period required by law or necessary for legal proceedings. Message logs and transmission records may be retained for extended periods to comply with telecommunications regulations.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Your Privacy Rights</h2>
          <p className="text-muted-foreground mb-4">
            Depending on where you reside, you may have various rights regarding your personal information:
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">For All Users</h3>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Access</strong>: You may request access to your personal information.</li>
            <li><strong>Correction</strong>: You may request correction of your personal information.</li>
            <li><strong>Deletion</strong>: You may request deletion of your account and personal information, subject to certain exceptions.</li>
            <li><strong>Communication Preferences</strong>: You can opt out of marketing communications at any time.</li>
          </ol>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">For California Residents</h3>
          <p className="text-muted-foreground mb-4">
            Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have additional rights:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Right to Know</strong>: You can request information about the personal information we have collected about you and how we have used and disclosed it.</li>
            <li><strong>Right to Request Deletion</strong>: You can request the deletion of your personal information, subject to certain exceptions.</li>
            <li><strong>Right to Opt-Out of Sale</strong>: We do not sell personal information, but you would have the right to opt-out if we did.</li>
            <li><strong>Right to Non-Discrimination</strong>: We will not discriminate against you for exercising any of your CCPA rights.</li>
          </ol>

          <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">For Canadian Users</h3>
          <p className="text-muted-foreground mb-4">
            Under the Personal Information Protection and Electronic Documents Act (PIPEDA) and provincial privacy laws, Canadian users have the right to:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Access</strong>: Access your personal information and be informed of its use and disclosure.</li>
            <li><strong>Correction</strong>: Request correction of your personal information if inaccurate or incomplete.</li>
            <li><strong>Withdrawal of Consent</strong>: Withdraw consent for the collection, use, or disclosure of your personal information.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Children's Privacy</h2>
          <p className="text-muted-foreground mb-4">
            Our Service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If we learn we have collected or received personal information from a child under 16 without verification of parental consent, we will delete that information.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">International Data Transfers</h2>
          <p className="text-muted-foreground mb-4">
            We are based in the United States, and your information may be processed in the United States and other countries where our service providers operate. These countries may have different data protection laws than your country of residence.
          </p>
          <p className="text-muted-foreground mb-4">
            When we transfer your information to other countries, we will protect that information as described in this Privacy Policy and comply with applicable legal requirements providing adequate protection for the transfer of information to countries outside of your country of residence.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Changes to Our Privacy Policy</h2>
          <p className="text-muted-foreground mb-4">
            We may update our Privacy Policy from time to time. If we make material changes to how we treat your personal information, we will notify you through a notice on our website or by email to the primary email address specified in your account.
          </p>
          <p className="text-muted-foreground mb-4">
            The date the Privacy Policy was last revised is identified at the top of the page. You are responsible for ensuring we have an up-to-date active and deliverable email address for you, and for periodically visiting our Service and this Privacy Policy to check for any changes.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Messaging Compliance</h2>
          <p className="text-muted-foreground mb-4">
            As a service provider that enables text messaging, we require all users to comply with applicable laws and regulations, including:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>TCPA (Telephone Consumer Protection Act)</strong>: Requires prior express consent before sending messages.</li>
            <li><strong>CASL (Canada's Anti-Spam Legislation)</strong>: Regulates commercial electronic messages sent to or from Canadian recipients.</li>
            <li><strong>CAN-SPAM Act</strong>: Establishes requirements for commercial messages and gives recipients the right to opt out.</li>
          </ol>
          <p className="text-muted-foreground mb-4">
            Our Service includes features to help you meet these requirements, such as consent tracking, opt-out management, and message history. However, you remain ultimately responsible for ensuring your messaging practices comply with all applicable laws.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Information</h2>
          <p className="text-muted-foreground mb-4">
            To ask questions or comment about this Privacy Policy and our privacy practices, contact us at:
          </p>
          <p className="text-muted-foreground mb-4">
            Better in Binary<br />
            betterinbinary@gmail.com
          </p>
          <p className="text-muted-foreground mb-4">
            If you have a complaint about our handling of your personal information, we will endeavor to address your complaint as soon as possible. We may ask you to submit your complaint in writing. We will respond to your complaint within 30 days of receipt and will take all reasonable steps to resolve the issue.
          </p>
        </div>
      </div>
    </div>
  );
}