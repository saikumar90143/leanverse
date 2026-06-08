import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  try {
    const data = await resend.emails.send({
      from: 'LeanVerse <no-reply@leanverse.in>', // Use your verified domain
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
