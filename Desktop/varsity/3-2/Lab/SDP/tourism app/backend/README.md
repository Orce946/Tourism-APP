# Tourism App Backend

## Run

1. Install dependencies:
   npm install

2. Start server:
   npm run dev

## MySQL setup

1. Create a database named `tourism_app`.
2. Run `sql/schema.sql` in MySQL.
3. Copy `.env.example` to `.env` and set your DB credentials.
4. Add `ADMIN1_PASSWORD` and `ADMIN2_PASSWORD` to `.env`.
5. Run `npm run seed:admins` to create or update the two fixed admin accounts.
6. To send verification emails, set `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM` in `.env`.
   - For Gmail, use a Google App Password, not your normal Gmail password.
   - Keep `EMAIL_USER` and `EMAIL_FROM` as the same Gmail address.
   - If you use a custom SMTP provider, set `SMTP_HOST`, `SMTP_PORT`, and optionally `SMTP_SECURE` too.
7. Quick local testing without real email (dev):
   - You can enable a developer fallback that logs verification codes instead of sending email. In `backend/.env` set:

```
USE_FAKE_EMAIL=true
```

   - When `USE_FAKE_EMAIL=true`, the server will log the verification code to the backend terminal and return a success response so you can complete signup without SMTP.

8. To send real emails in production, set `USE_FAKE_EMAIL=false`, populate `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM`, then restart the server.

## Test users

- Admin 1: rebekasultanaorce455@gmail.com / value from ADMIN1_PASSWORD
- Admin 2: punam.papri@gmail.com / value from ADMIN2_PASSWORD
- Public users: create an account first with any email you choose, then log in

## Email Troubleshooting

If verification emails are not reaching the inbox:

1. **Check credentials**: Ensure `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_FROM` are set in `.env`.
   - For Gmail: Use an App Password (not your normal password), and enable 2-Step Verification on your account.
   - After updating `.env`, restart the backend with `npm run dev`.

2. **Test email sending**: Use the test endpoint to verify your SMTP config:
   ```bash
   curl -X POST http://localhost:5000/api/auth/test-email \
     -H "Content-Type: application/json" \
     -d '{"email":"your-test@gmail.com"}'
   ```
   - Check the backend terminal for `[TEST-EMAIL]` logs to see what happened.

3. **Check logs**: Look at the backend terminal for `[MAIL]` and `[TEST-EMAIL]` logs:
   - `[MAIL] SUCCESS` = Email left the server, check Spam folder.
   - `[MAIL] FAILED` = SMTP error, check the error message.
   - `[MAIL] Transporter is null` = Missing EMAIL_USER/EMAIL_PASS.

4. **Check Spam folder**: New email services sometimes go to Spam by default.

## Endpoints

- GET /health
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/test-email (debug: sends a test email)
- POST /api/auth/send-verification-code
- POST /api/auth/verify-code
- POST /api/auth/register-verified
- GET /api/divisions
- GET /api/divisions/:id
- GET /api/profile
- GET /api/admin/dashboard
