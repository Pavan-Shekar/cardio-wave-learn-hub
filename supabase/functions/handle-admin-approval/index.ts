import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const supabase = createClient(
  "https://zoxexartardlpawstxjx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpveGV4YXJ0YXJkbHBhd3N0eGp4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzIyNzgwNiwiZXhwIjoyMDYyODAzODA2fQ.wXOdSECRJLeiOFnC8FECccNL8bjm7_wbJBwnS-MkQAM"
);

const resend = new Resend("re_QnEqYdfm_8SeLcXSFS8nJQ8r24p5c7TRG");

const handler = async (req: Request): Promise<Response> => {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const user_id = url.searchParams.get("user_id");

    if (!action || !user_id) {
      return new Response("Missing required parameters", { status: 400 });
    }

    if (action !== "approve" && action !== "reject") {
      return new Response("Invalid action", { status: 400 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user_id)
      .single();

    if (profileError || !profile) {
      return new Response("User not found", { status: 404 });
    }

    // Update user approval status
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        approved: action === "approve",
        pending_reason: action === "approve" ? null : "Admin registration was rejected by administrator"
      })
      .eq("id", user_id);

    if (updateError) {
      console.error("Error updating user approval:", updateError);
      return new Response("Error updating user status", { status: 500 });
    }

    // Send notification email to the user
    const subject = action === "approve" 
      ? "Admin Access Approved - ECG Education Portal"
      : "Admin Access Request Rejected - ECG Education Portal";

    const emailContent = action === "approve" 
      ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0 0 10px 0;">ECG Education Portal</h1>
            <p style="color: #666; margin: 0;">Admin Access Approved</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
            <h2 style="color: #22c55e; margin: 0 0 15px 0;">🎉 Congratulations!</h2>
            <p style="color: #333; margin: 0 0 15px 0;">Your admin access request has been approved!</p>
            
            <div style="background-color: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; margin: 15px 0;">
              <p style="margin: 0 0 5px 0;"><strong>Name:</strong> ${profile.name}</p>
              <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${profile.email}</p>
              <p style="margin: 0;"><strong>Role:</strong> Administrator</p>
            </div>
            
            <p style="color: #333; margin: 15px 0;">You can now log in to the ECG Education Portal with full administrator privileges.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://zoxexartardlpawstxjx.supabase.app/login" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Login to Admin Portal
              </a>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              <strong>Next Steps:</strong>
            </p>
            <ul style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
              <li>Access the admin dashboard to manage content</li>
              <li>Review user registrations and approvals</li>
              <li>Monitor system usage and analytics</li>
            </ul>
          </div>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="color: #2563eb; margin: 0 0 10px 0;">ECG Education Portal</h1>
            <p style="color: #666; margin: 0;">Admin Access Request Update</p>
          </div>
          
          <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
            <h2 style="color: #ef4444; margin: 0 0 15px 0;">Request Not Approved</h2>
            <p style="color: #333; margin: 0 0 15px 0;">Unfortunately, your admin access request has not been approved at this time.</p>
            
            <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; border-left: 4px solid #ef4444; margin: 15px 0;">
              <p style="margin: 0 0 5px 0;"><strong>Name:</strong> ${profile.name}</p>
              <p style="margin: 0 0 5px 0;"><strong>Email:</strong> ${profile.email}</p>
              <p style="margin: 0;"><strong>Requested Role:</strong> Administrator</p>
            </div>
            
            <p style="color: #333; margin: 15px 0;">You can still register and use the portal as a student user to access learning materials.</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://zoxexartardlpawstxjx.supabase.app/register" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Register as Student
              </a>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              If you have questions about this decision or need to discuss admin access further, 
              please contact the system administrator.
            </p>
          </div>
        </div>
      `;

    await resend.emails.send({
      from: "ECG Education Portal <onboarding@resend.dev>",
      to: [profile.email],
      subject: subject,
      html: emailContent,
    });

    // Return success page
    const successMessage = action === "approve" 
      ? `✅ Admin access approved for ${profile.name} (${profile.email}). They have been notified via email.`
      : `❌ Admin access rejected for ${profile.name} (${profile.email}). They have been notified via email.`;

    return new Response(`
      <html>
        <head>
          <title>Admin Approval - ECG Education Portal</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>Action Completed Successfully</h1>
            <p>${successMessage}</p>
            <a href="https://zoxexartardlpawstxjx.supabase.co/project/zoxexartardlpawstxjx/auth/users" class="button">
              View Users in Supabase Dashboard
            </a>
          </div>
        </body>
      </html>
    `, {
      headers: { "Content-Type": "text/html" },
    });

  } catch (error: any) {
    console.error("Error in handle-admin-approval function:", error);
    return new Response(
      `<html><body><h1>Error</h1><p>${error.message}</p></body></html>`,
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      }
    );
  }
};

serve(handler);