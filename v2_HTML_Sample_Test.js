// --- Configuration: Premium Minimalist Theme ---
const theme = {
  bg: "#f8f9fa",
  cardBg: "#ffffff",
  cardSecondary: "#fafbfc",
  textMain: "#111111",
  textBody: "#333333",
  textSec: "#6c757d",
  accent: "#0066cc",
  accentLight: "#fff3e0",
  accentOrange: "#ff6b00",
  border: "#e9ecef",
  footerBg: "#f1f3f5"
};

// 1. Get Input Data
const markdownInput = items[0].json.text || '';

// 2. Parser Engine (Robust Regex)
function parseArticles(markdown) {
  const results = [];
  
  // Split by "Headline" to isolate articles
  const rawItems = markdown.split(/\*\*Headline\*\*:/i).slice(1);
  
  rawItems.forEach(raw => {
    // Extract fields safely
    const headline = (raw.match(/^(.*?)(?=\n|\*\*Source)/s) || [])[1];
    const source = (raw.match(/\*\*Source\*\*:\s*(.*?)(?=\n|\*\*Summary)/i) || [])[1];
    const summary = (raw.match(/\*\*Summary\*\*:\s*(.*?)(?=\n|\*\*Link)/i) || [])[1];
    
    // Capture Markdown links [Title](url) OR raw URLs https://...
    const linkMatch = raw.match(/\*\*Link\*\*:\s*(?:(?:\[.*?\]\((.*?)\))|(https?:\/\/[^\s]+))/i);
    const link = linkMatch ? (linkMatch[1] || linkMatch[2]) : null;
    
    if (headline && link) {
      results.push({
        headline: headline.trim(),
        source: source ? source.trim().toUpperCase() : 'NEWS',
        summary: summary ? summary.trim() : '',
        link: link.trim()
      });
    }
  });
  
  return results;
}

// 3. Process Data
const articles = parseArticles(markdownInput);
const date = new Date();

// Format: "Friday, Jan 5"
const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
const dateStr = date.toLocaleDateString('en-US', dateOptions);

let emailContent = '';

if (articles.length > 0) {
  // --- A. THE HERO STORY (First Article) ---
  const hero = articles[0];
  const heroHtml = `
  <tr>
    <td class="hero-pad mobile-pad" style="padding: 60px 60px 45px 60px;">
      <div style="display: inline-block; padding: 6px 12px; background-color: ${theme.accentLight}; border-radius: 4px; margin-bottom: 20px;">
        <p style="margin: 0; font-size: 10px; font-weight: 700; color: ${theme.accentOrange}; text-transform: uppercase; letter-spacing: 1.2px;">
          ★ Top Story
        </p>
      </div>
      <h2 class="hero-headline" style="margin: 0 0 20px 0; font-size: 32px; font-weight: 800; line-height: 1.3; color: ${theme.textMain};">
        <a href="${hero.link}" style="text-decoration: none; color: ${theme.textMain};">${hero.headline}</a>
      </h2>
      <p style="margin: 0 0 28px 0; font-size: 17px; line-height: 1.6; color: ${theme.textBody}; font-weight: 400;">
        ${hero.summary}
      </p>
      <a href="${hero.link}" style="display: inline-block; font-size: 14px; font-weight: 700; color: ${theme.accent}; text-decoration: none; padding-bottom: 2px; border-bottom: 2px solid ${theme.accent};">
        Read the full analysis →
      </a>
    </td>
  </tr>
  <tr>
    <td style="padding: 0 60px;" class="mobile-pad">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr><td style="border-top: 1px solid ${theme.border}; padding: 20px 0;"></td></tr>
      </table>
    </td>
  </tr>
  `;

  // --- B. THE BRIEF (Remaining Articles) ---
  const others = articles.slice(1);
  const listHtml = others.map(item => `
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" class="article-card" style="margin-bottom: 35px; background-color: ${theme.cardSecondary}; border-radius: 8px; border: 1px solid ${theme.border}; overflow: hidden;">
    <tr>
      <td style="padding: 25px;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td valign="top" width="12" style="padding-top: 7px;">
              <div style="width: 8px; height: 8px; background-color: ${theme.accent}; border-radius: 50%;"></div>
            </td>
            <td valign="top" style="padding-left: 18px;">
              <h3 style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; line-height: 1.4; color: ${theme.textMain};">
                <a href="${item.link}" style="text-decoration: none; color: ${theme.textMain};">${item.headline}</a>
              </h3>
              <p style="margin: 0 0 10px 0; font-size: 15px; line-height: 1.6; color: ${theme.textBody};">
                ${item.summary}
              </p>
              <p style="margin: 0; font-size: 11px; color: ${theme.textSec}; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">
                ${item.source}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  `).join('');

  const sectionHtml = `
  <tr>
    <td class="mobile-pad" style="padding: 20px 60px 40px 60px;">
      <p style="margin: 0 0 30px 0; font-size: 12px; font-weight: 700; color: ${theme.textSec}; text-transform: uppercase; letter-spacing: 1.2px;">
        In Brief
      </p>
      ${listHtml}
    </td>
  </tr>
  `;

  emailContent = heroHtml + sectionHtml;
} else {
  // Fallback if empty
  emailContent = `
  <tr>
    <td style="padding: 60px; text-align: center;">
      <p style="margin: 0; font-size: 16px; color: ${theme.textSec}; line-height: 1.6;">
        No updates available today.<br>
        Check back tomorrow for the latest intelligence.
      </p>
    </td>
  </tr>
  `;
}

// 4. Assemble Final HTML
const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>AI Flux - The Daily Brief</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
    <style>
        /* Client-specific resets */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        
        /* Remove spaces around the email design */
        html, body { margin: 0; padding: 0; height: 100% !important; width: 100% !important; }
        
        /* Prevent iOS auto-linking */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        
        /* Mobile Styles */
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; max-width: 100% !important; }
            .mobile-pad { padding-left: 25px !important; padding-right: 25px !important; }
            .hero-pad { padding: 40px 25px 35px 25px !important; }
            .h1 { font-size: 28px !important; }
            .hero-headline { font-size: 24px !important; }
            .article-card { margin-bottom: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${theme.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
    
    <!-- Wrapper Table -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${theme.bg};">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                
                <!-- Main Container -->
                <table role="presentation" class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: ${theme.cardBg}; max-width: 600px; width: 100%; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    
                    <!-- Header -->
                    <tr>
                        <td class="mobile-pad" style="padding: 50px 60px 35px 60px; border-bottom: 3px solid ${theme.textMain};">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="left">
                                        <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: ${theme.textSec};">
                                            ${dateStr} • Daily Intelligence
                                        </p>
                                        <h1 class="h1" style="margin: 0; font-size: 38px; font-weight: 800; letter-spacing: -1.5px; line-height: 1; color: ${theme.textMain};">
                                            AI FLUX.
                                        </h1>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    ${emailContent}
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 35px 60px; background-color: ${theme.footerBg}; border-top: 1px solid ${theme.border};" class="mobile-pad">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="left">
                                        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: ${theme.textMain}; letter-spacing: 0.5px;">AI FLUX</p>
                                        <p style="margin: 0; font-size: 13px; color: ${theme.textSec}; line-height: 1.6;">
                                            Automated Intelligence Briefing<br>
                                            <a href="#" style="color: ${theme.accent}; text-decoration: none; font-weight: 500;">Manage preferences</a> · 
                                            <a href="#" style="color: ${theme.textSec}; text-decoration: none;">Unsubscribe</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
                <!-- End Main Container -->
                
            </td>
        </tr>
    </table>
    <!-- End Wrapper Table -->
    
</body>
</html>`;

// 5. Return the result
return [{ json: { emailBodyHtml: finalHtml } }];