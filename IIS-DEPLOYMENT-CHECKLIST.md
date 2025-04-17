# IIS Deployment Checklist

Use this checklist to ensure you've completed all necessary steps for deploying your Next.js application to IIS.

## Pre-Deployment

- [ ] Install Node.js on the server
- [ ] Install IIS on the server
- [ ] Install URL Rewrite Module for IIS
- [ ] Install Application Request Routing (ARR) for IIS
- [ ] Install iisnode module

## Build Application

- [ ] Run `npm run build` to create production build
- [ ] Verify the `.next` directory was created
- [ ] Ensure `server.js` file exists in the root directory
- [ ] Ensure `web.config` file exists in the root directory

## Server Configuration

- [ ] Create a new website or application in IIS Manager
- [ ] Set the physical path to your application folder
- [ ] Configure application pool to use "No Managed Code"
- [ ] Set application pool identity to a user with sufficient permissions
- [ ] Set "Enable 32-bit Applications" to "False" if on a 64-bit system

## File Deployment

- [ ] Copy the entire application directory to the server, including:
  - [ ] `node_modules` folder
  - [ ] `.next` folder
  - [ ] `public` folder
  - [ ] `server.js`
  - [ ] `web.config`
  - [ ] `package.json`
  - [ ] Any other necessary files (e.g., `.env`)

## Final Configuration

- [ ] Set appropriate file permissions for the application pool identity
- [ ] Verify Node.js is in the system PATH
- [ ] Configure any necessary environment variables in IIS
- [ ] Start/restart the website in IIS

## Testing

- [ ] Verify the website loads correctly
- [ ] Test navigation between pages
- [ ] Test API endpoints
- [ ] Check for any errors in the iisnode logs

## Troubleshooting

If you encounter issues:

- [ ] Check iisnode logs in the `iisnode` directory
- [ ] Verify all required modules are installed
- [ ] Check IIS logs in `%SystemDrive%\inetpub\logs\LogFiles`
- [ ] Verify file permissions
- [ ] Ensure application pool identity has access to Node.js

## Notes

- The application is built to run with a custom server.js file
- API routes require server-side rendering, so static export is not used
- The web.config file is configured for iisnode to handle server-side rendering
