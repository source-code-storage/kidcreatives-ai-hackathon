# Disable Email Confirmation for Demo/Judging

To make it easier for judges to test the application without email confirmation:

## Steps to Disable Email Confirmation

1. Go to your Supabase Dashboard:
   https://supabase.com/dashboard/project/rlkvtubxsxfkrwuvvvcn

2. Navigate to **Authentication** in the left sidebar

3. Click on **Providers**

4. Find **Email** in the list and click on it

5. **Uncheck** the box that says:
   - ☐ **Confirm email**

6. Click **Save** at the bottom

## Result

After this change:
- Users can sign up and immediately access the app
- No email confirmation required
- Perfect for demo/judging scenarios

## Alternative: Test Accounts

You can also create test accounts for judges:
- Email: `judge1@test.com` / Password: `judge123`
- Email: `judge2@test.com` / Password: `judge123`
- Email: `demo@test.com` / Password: `demo123`

Just sign up with these credentials and share them with judges.

## Re-enable for Production

When deploying to production:
1. Go back to Authentication > Providers > Email
2. Check ☑ **Confirm email**
3. Save

This ensures proper email verification for real users.
