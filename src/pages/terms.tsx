import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Terms() {
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
          <h1 className="text-4xl font-bold text-foreground mb-8">TextBlaster CRM - Terms of Use</h1>
          
          <p className="text-muted-foreground mb-8"><strong>Last Updated: April 27, 2025</strong></p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Introduction</h2>
          <p className="text-muted-foreground mb-4">
            Welcome to TextBlaster CRM ("Service"), a lightweight, human-centered Customer Relationship Management system with simple messaging capabilities designed for small businesses to maintain personal connections with clients. These Terms of Use ("Terms") govern your access to and use of TextBlaster CRM provided by Better in Binary ("Company," "we," "us," or "our").
          </p>
          <p className="text-muted-foreground mb-4">
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service. These Terms constitute a legal agreement between you and Better in Binary.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Account Registration and Security</h2>
          <p className="text-muted-foreground mb-4">
            To use our Service, you must register and create an account. You agree to:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>Provide accurate, current, and complete information</li>
            <li>Maintain and promptly update your account information</li>
            <li>Keep your password secure and confidential</li>
            <li>Not share your account with anyone else</li>
            <li>Notify us immediately of any unauthorized access to or use of your account</li>
          </ol>
          <p className="text-muted-foreground mb-4">
            You are solely responsible for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Acceptable Use</h2>
          <p className="text-muted-foreground mb-4">
            You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>Use the Service in any way that violates any applicable law or regulation</li>
            <li>Use the Service to send unsolicited commercial messages ("spam")</li>
            <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with a person or entity</li>
            <li>Interfere with or disrupt the integrity or performance of the Service</li>
            <li>Attempt to gain unauthorized access to the Service or related systems</li>
            <li>Collect or store personal information about other users without their consent</li>
            <li>Use the Service for any harmful or fraudulent purpose</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Messaging and Consent Requirements</h2>
          <p className="text-muted-foreground mb-4">
            TextBlaster CRM includes features that allow you to send text messages to your clients. You acknowledge and agree that:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>You will comply with all applicable laws and regulations related to electronic communications, including but not limited to:
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>The Telephone Consumer Protection Act (TCPA) in the United States</li>
                <li>Canada's Anti-Spam Legislation (CASL) in Canada</li>
                <li>Any applicable state, provincial, or local laws</li>
              </ul>
            </li>
            <li>You will obtain proper consent from recipients before sending any commercial messages, as required by applicable laws.</li>
            <li>You will provide clear and conspicuous disclosure to recipients about:
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>The fact that they will receive messages from you</li>
                <li>The purpose and frequency of these messages</li>
                <li>Any applicable charges (e.g., message and data rates may apply)</li>
                <li>How to opt out of receiving future messages</li>
              </ul>
            </li>
            <li>You will honor opt-out requests promptly (within 10 business days) and maintain appropriate records of consent and opt-outs.</li>
            <li>You will not send messages outside of permitted hours (generally between 8 a.m. and 9 p.m. in the recipient's local time zone, though some jurisdictions may have more restrictive rules).</li>
            <li>You will include in each message:
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Your identity (name of your business or organization)</li>
                <li>Contact information (including a physical address)</li>
                <li>A clear and simple method for recipients to opt out</li>
              </ul>
            </li>
            <li>You will maintain accurate records of consent for all recipients.</li>
            <li>You will not send messages containing prohibited content, including but not limited to:
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Content related to cannabis, CBD, or illegal drugs</li>
                <li>Offers for prescription medication that cannot legally be sold over-the-counter</li>
                <li>Hate speech, harassment, or abusive communications</li>
                <li>Fraudulent messages or malicious content</li>
                <li>Content designed to intentionally evade filters</li>
              </ul>
            </li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Message Credits</h2>
          <p className="text-muted-foreground mb-4">
            Our Service operates on a credit-based system for sending messages:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>You must purchase message credits to send messages through our Service.</li>
            <li>Message credits are non-refundable once purchased.</li>
            <li>We reserve the right to modify our credit pricing at any time with reasonable notice.</li>
            <li>Credits may expire after a specific period as indicated at the time of purchase.</li>
            <li>Any promotional or bonus credits may have different terms, which will be specified when provided.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Third-Party Services</h2>
          <p className="text-muted-foreground mb-4">
            Our Service integrates with Twilio and other third-party services for message delivery and other functionalities. You acknowledge that:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>Your use of such third-party services is subject to their respective terms and conditions.</li>
            <li>We are not responsible for the performance, availability, or security of third-party services.</li>
            <li>You are responsible for complying with Twilio's Acceptable Use Policy and Messaging Policy, available at https://www.twilio.com/legal/aup and https://www.twilio.com/legal/messaging-policy.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Data and Privacy</h2>
          <p className="text-muted-foreground mb-4">
            Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices regarding your data.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Intellectual Property</h2>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Our Intellectual Property</strong>: The Service and its original content, features, and functionality are owned by Better in Binary and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</li>
            <li><strong>Your Data</strong>: You retain all rights to your data. By using our Service, you grant us a limited license to use your data solely to provide, maintain, and improve the Service.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Fees and Payment</h2>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Subscription Fees</strong>: You agree to pay all fees associated with your account. Fees are non-refundable except as required by law or as explicitly stated in these Terms.</li>
            <li><strong>Payment Information</strong>: You will provide accurate and complete payment information. You authorize us to charge your payment method for all fees incurred.</li>
            <li><strong>Price Changes</strong>: We may change our prices at any time. We will provide you with reasonable notice of any price changes.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Termination</h2>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li><strong>Termination by You</strong>: You may terminate your account at any time by following the instructions on our website.</li>
            <li><strong>Termination by Us</strong>: We may terminate or suspend your account at any time for any reason, including if you violate these Terms.</li>
            <li><strong>Effect of Termination</strong>: Upon termination, your right to use the Service will immediately cease. All provisions that by their nature should survive termination shall survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Disclaimers</h2>
          <p className="text-muted-foreground mb-4">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p className="text-muted-foreground mb-4">We do not warrant that:</p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>The Service will function uninterrupted, secure, or available at any particular time or location</li>
            <li>Any errors or defects will be corrected</li>
            <li>The Service is free of viruses or other harmful components</li>
            <li>The results of using the Service will meet your requirements</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Limitation of Liability</h2>
          <p className="text-muted-foreground mb-4">
            IN NO EVENT SHALL BETTER IN BINARY, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>Your access to or use of or inability to access or use the Service</li>
            <li>Any conduct or content of any third party on the Service</li>
            <li>Any content obtained from the Service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ol>
          <p className="text-muted-foreground mb-4">
            WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE, AND EVEN IF A REMEDY SET FORTH HEREIN IS FOUND TO HAVE FAILED OF ITS ESSENTIAL PURPOSE.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Indemnification</h2>
          <p className="text-muted-foreground mb-4">
            You agree to defend, indemnify, and hold harmless Better in Binary, its affiliates, licensors, and service providers, and its and their respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to:
          </p>
          <ol className="list-decimal list-inside text-muted-foreground space-y-2 mb-4">
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party right, including without limitation any intellectual property right or privacy right</li>
            <li>Your violation of any applicable law or regulation, including laws regarding electronic communications</li>
            <li>Any claim that your use of the Service caused damage to a third party</li>
          </ol>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last Updated" date at the top of this page. Your continued use of the Service after any changes to the Terms constitutes your acceptance of such changes.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Governing Law and Jurisdiction</h2>
          <p className="text-muted-foreground mb-4">
            These Terms shall be governed by and construed in accordance with the laws of the United States. Any disputes relating to these Terms shall be subject to the exclusive jurisdiction of the courts of the United States.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Severability</h2>
          <p className="text-muted-foreground mb-4">
            If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Entire Agreement</h2>
          <p className="text-muted-foreground mb-4">
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and Better in Binary regarding your use of the Service and supersede all prior and contemporaneous agreements, representations, or understandings between you and Better in Binary.
          </p>

          <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p className="text-muted-foreground mb-4">
            Better in Binary<br />
            betterinbinary@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
}