# Spark Grid Energy Website

Professional energy efficiency website for **sparkgridenergy.com.au**

## Pages

- `index.html` - Homepage
- `about.html` - About Us
- `contact.html` - Contact form
- `led-lighting.html` - LED Lighting service
- `hot-water.html` - Hot Water Heater service
- `solar.html` - Solar Installation service
- `rebate-programs.html` - Government rebate programs
- `partner-program.html` - Partner Program
- `careers.html` - Careers
- `privacy-policy.html` - Privacy Policy

## Local Preview

```bash
cd Sparkgridenergy
python3 -m http.server 8080
```

Open http://localhost:8080

## Deploy to Hostinger

### Step 1: Get Web Hosting

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com)
2. Go to **Websites** → **Add Website**
3. Select **sparkgridenergy.com.au** and choose a hosting plan
4. Complete the setup wizard

### Step 2: Upload Website Files

**Option A – File Manager (easiest)**

1. In hPanel, go to **Websites** → **Manage** → **File Manager**
2. Open the `public_html` folder
3. Delete any default files
4. Upload all project files to `public_html/`

**Option B – FTP**

1. In hPanel, go to **Files** → **FTP Accounts**
2. Use FileZilla to upload to `public_html/`

### Step 3: Point Domain to Hosting

1. In hPanel, go to **Domains** → **sparkgridenergy.com.au**
2. Update nameservers to Hostinger hosting nameservers
3. Enable **Free SSL** and **Force HTTPS**

## Customization

Update phone, email, address, and social links in the HTML files.
