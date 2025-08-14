import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const tx_ref = url.searchParams.get('tx_ref')
    const transaction_id = url.searchParams.get('transaction_id')

    console.log('Payment success page accessed:', { status, tx_ref, transaction_id })

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Success - LexiPay AI</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                background: linear-gradient(135deg, #007A33 0%, #002F6C 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container {
                background: white;
                border-radius: 20px;
                padding: 40px;
                max-width: 400px;
                width: 100%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .success-icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: #007A33;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 20px;
                color: white;
                font-size: 40px;
            }
            h1 {
                color: #1a1a1a;
                margin: 0 0 10px;
                font-size: 24px;
            }
            p {
                color: #666;
                margin: 0 0 30px;
                line-height: 1.5;
            }
            .button {
                background: #25D366;
                color: white;
                border: none;
                border-radius: 12px;
                padding: 15px 30px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                transition: background 0.2s;
            }
            .button:hover {
                background: #20BA5A;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                color: #999;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p>Your payment has been processed successfully. You will receive a confirmation message on WhatsApp shortly.</p>
            ${tx_ref ? `<p><small>Transaction ID: ${tx_ref}</small></p>` : ''}
            <a href="https://wa.me/2348105786326?text=Hi%2C%20I%20just%20completed%20a%20payment%20and%20want%20to%20continue%20using%20LexiPay%20AI" class="button">
                Continue on WhatsApp
            </a>
            <div class="footer">
                <strong>LexiPay AI</strong><br>
                Powered by ODIA.Dev
            </div>
        </div>
    </body>
    </html>
    `

    return new Response(html, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
      status: 200,
    })

  } catch (error) {
    console.error('Payment success page error:', error)
    
    const errorHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - LexiPay AI</title>
    </head>
    <body>
        <h1>Something went wrong</h1>
        <p>Please contact support via WhatsApp.</p>
    </body>
    </html>
    `

    return new Response(errorHtml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
      status: 500,
    })
  }
})