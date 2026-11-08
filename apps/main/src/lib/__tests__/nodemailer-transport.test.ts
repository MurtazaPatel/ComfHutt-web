/**
 * D63: nodemailer 10 smoke test. apps/main declares nodemailer but no source
 * file imports it yet, so this exercises the library itself through its
 * in-memory jsonTransport / streamTransport (no network) to pin the message
 * fields a future mailer would produce.
 */
import nodemailer from 'nodemailer'

const message = {
  from: 'ComfHutt <no-reply@comfhutt.example>',
  to: 'buyer@example.com',
  subject: 'Welcome to ComfHutt',
  html: '<p>Hello <b>buyer</b></p>',
}

describe('nodemailer 10 transport', () => {
  it('builds a json transport and produces the expected message fields', async () => {
    const transport = nodemailer.createTransport({ jsonTransport: true })
    const info = await transport.sendMail(message)
    const sent = JSON.parse(info.message as string)

    expect(sent.from).toEqual({ address: 'no-reply@comfhutt.example', name: 'ComfHutt' })
    expect(sent.to).toEqual([{ address: 'buyer@example.com', name: '' }])
    expect(sent.subject).toBe(message.subject)
    expect(sent.html).toBe(message.html)
    expect(info.envelope).toEqual({
      from: 'no-reply@comfhutt.example',
      to: ['buyer@example.com'],
    })
  })

  it('renders a MIME message through the stream transport', async () => {
    const transport = nodemailer.createTransport({ streamTransport: true, buffer: true, newline: 'unix' })
    const info = await transport.sendMail(message)
    const raw = (info.message as Buffer).toString()

    expect(raw).toContain('From: ComfHutt <no-reply@comfhutt.example>')
    expect(raw).toContain('To: buyer@example.com')
    expect(raw).toContain('Subject: Welcome to ComfHutt')
    expect(raw).toContain('Content-Type: text/html')
    expect(raw).toContain('<p>Hello <b>buyer</b></p>')
  })
})
