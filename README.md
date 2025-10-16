diff --git a/README.md b/README.md
new file mode 100644
index 0000000000000000000000000000000000000000..6a8f1b6525f8c38b9ebd70769f10cc2cd1d3f3bf
--- /dev/null
+++ b/README.md
@@ -0,0 +1,35 @@
+# Senior Engineering Design Site
+
+This repository contains the static assets for the Senior Engineering Design site. Pages are compiled manually and hosted using GitHub Pages.
+
+## Contact form configuration
+
+The contact form on [`contact.html`](contact.html) relies on [Formspree](https://formspree.io/) for handling submissions. Deployments must ensure a valid Formspree form is configured.
+
+1. Log in to Formspree and create (or reuse) a form. Copy the form ID from the dashboard (it looks like `mrgnzgek`).
+2. Update the `<form>` element's `action` attribute in [`contact.html`](contact.html) so it points to `https://formspree.io/f/<YOUR_FORM_ID>`.
+3. Deploy the updated site. Once live, send a test submission and confirm you receive the notification email configured in Formspree.
+
+### Verifying from the command line
+
+You can manually verify the endpoint before shipping:
+
+```bash
+curl -i https://formspree.io/f/<YOUR_FORM_ID> \
+  -H 'Accept: application/json' \
+  -d 'name=Test User&email=test@example.com&message=Hello'
+```
+
+A valid configuration will return a `200 OK` response along with a JSON body similar to:
+
+```json
+{"ok":true,"message":"Form submitted"}
+```
+
+The site reads the `message` field from this response and surfaces it directly to the visitor. Errors return a JSON payload that includes an `errors` array; the first messages from that array are shown inline above the form submit button.
+
+If you see a 4xx response, double-check that the domain hosting the site is allowed for the Formspree project and that the form ID is correct.
+
+### Local development reminder
+
+This repository does not include build tooling. Open `index.html` (or any other page) directly in a browser or via a static file server when testing locally.
