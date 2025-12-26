import type { APIRoute } from 'astro';
import { ImageResponse } from '@vercel/og';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const title = url.searchParams.get('title') || 'Mike Lacey';
  const subtitle = url.searchParams.get('subtitle') || 'Television Director';

  // Read the headshot image
  const headshotPath = process.env.NODE_ENV === 'development'
    ? path.resolve('./public/images/headshot.jpg')
    : path.resolve('./dist/client/images/headshot.jpg');

  let headshotSrc = '';
  try {
    const headshotBuffer = fs.readFileSync(headshotPath);
    headshotSrc = `data:image/jpeg;base64,${headshotBuffer.toString('base64')}`;
  } catch (e) {
    console.error('Failed to read headshot:', e);
  }

  const html = {
    type: 'div',
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom right, #1c1917, #1c1917, #172554)',
        fontFamily: 'system-ui, sans-serif',
        padding: '50px 70px',
      },
      children: [
        // Main content row
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flex: 1,
              alignItems: 'center',
            },
            children: [
              // Left content section
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 1,
                    paddingRight: '40px',
                  },
                  children: [
                    // Eyebrow text
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '16px',
                          color: '#fbbf24',
                          textTransform: 'uppercase',
                          letterSpacing: '0.25em',
                          fontWeight: 600,
                          marginBottom: '16px',
                        },
                        children: 'Trusted by the Industry\'s Best',
                      },
                    },
                    // Main title
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '80px',
                          fontWeight: 'bold',
                          color: 'white',
                          lineHeight: 1.0,
                          marginBottom: '8px',
                        },
                        children: title,
                      },
                    },
                    // Subtitle
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '40px',
                          color: '#e7e5e4',
                          fontWeight: 500,
                          marginBottom: '20px',
                        },
                        children: subtitle,
                      },
                    },
                    // Tagline
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: '22px',
                          color: '#78716c',
                          lineHeight: 1.4,
                        },
                        children: 'Sports & Entertainment Production',
                      },
                    },
                  ],
                },
              },
              // Right side - Headshot (larger)
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                  children: headshotSrc ? [
                    {
                      type: 'img',
                      props: {
                        src: headshotSrc,
                        style: {
                          width: '420px',
                          height: '420px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '6px solid rgba(255, 255, 255, 0.1)',
                        },
                      },
                    },
                  ] : [],
                },
              },
            ],
          },
        },
        // Bottom bar with URL
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '18px',
                    color: '#57534e',
                    letterSpacing: '0.05em',
                  },
                  children: 'themikelacey.com',
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '28px',
                    fontSize: '15px',
                    color: '#a8a29e',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 500,
                  },
                  children: [
                    { type: 'span', props: { children: 'Golf Channel' } },
                    { type: 'span', props: { children: 'NBC' } },
                    { type: 'span', props: { children: 'ABC' } },
                    { type: 'span', props: { children: 'ESPN' } },
                    { type: 'span', props: { children: 'MTV' } },
                    { type: 'span', props: { children: 'Nickelodeon' } },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };

  return new ImageResponse(html as React.ReactElement, {
    width: 1200,
    height: 630,
  });
};
