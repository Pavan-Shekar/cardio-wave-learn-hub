import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AdminApprovalRequest {
  user_id: string;
  user_name: string;
  user_email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, user_name, user_email }: AdminApprovalRequest = await req.json();

    const approvalUrl = `https://zoxexartardlpawstxjx.supabase.co/functions/v1/handle-admin-approval?action=approve&user_id=${user_id}`;
    const rejectUrl = `https://zoxexartardlpawstxjx.supabase.co/functions/v1/handle-admin-approval?action=reject&user_id=${user_id}`;

    const emailResponse = await resend.emails.send({
      from: "ECG Education Portal <onboarding@resend.dev>",
      to: ["pavanrapaka73@gmail.com"],
      subject: "New Admin Registration Approval Required",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0 0 10px 0;">ECG Education Portal</h1>
            <p style="color: #666; margin: 0;">Admin Approval Request</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
            <h2 style="color: #333; margin: 0 0 15px 0;">New Admin Registration</h2>
            <p style="color: #333; margin: 0 0 10px 0;">A new user has registered for admin access:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
              <p style="margin: 0 0 5px 0;"><strong>Name:</strong> ${user_name}</p>
              <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${user_email}</p>
              <p style="margin: 0;"><strong>Role:</strong> Administrator</p>
            </div>
            
            <p style="color: #333; margin: 15px 0 0 0;">Please review this request and take appropriate action:</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${approvalUrl}" style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px; font-weight: 500;">
              ✓ Approve Access
            </a>
            <a href="${rejectUrl}" style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              ✗ Reject Request
            </a>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              <strong>Note:</strong> Click the buttons above to approve or reject this admin request. 
              The user will be notified of your decision via email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #666; font-size: 12px; margin: 0;">
              ECG Education Portal - Admin Management System
            </p>
          </div>
        </div>
      `,
    });

    console.log("Admin approval email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-approval-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);