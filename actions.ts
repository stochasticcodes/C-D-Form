'use server'

import { z } from 'zod'

const formSchema = z.object({
  senderName: z.string().min(1),
  senderEmail: z.string().email(),
  recipientName: z.string().min(1),
  recipientEmail: z.string().email(),
  recipientAddress: z.string().min(1),
  date: z.string().min(1),
  reason: z.string().min(1),
  specificActions: z.string().min(1),
  deadline: z.string().min(1),
  consequences: z.string().min(1),
  legalRights: z.string().min(1),
  sendViaMail: z.string().transform(val => val === 'true'),
})

export async function sendCeaseAndDesist(formData: FormData) {
  const validatedFields = formSchema.safeParse({
    senderName: formData.get('senderName'),
    senderEmail: formData.get('senderEmail'),
    recipientName: formData.get('recipientName'),
    recipientEmail: formData.get('recipientEmail'),
    recipientAddress: formData.get('recipientAddress'),
    date: formData.get('date'),
    reason: formData.get('reason'),
    specificActions: formData.get('specificActions'),
    deadline: formData.get('deadline'),
    consequences: formData.get('consequences'),
    legalRights: formData.get('legalRights'),
    sendViaMail: formData.get('sendViaMail'),
  })

  if (!validatedFields.success) {
    return { success: false, error: 'Invalid form data' }
  }

  const { 
    senderName, 
    senderEmail, 
    recipientName, 
    recipientEmail, 
    recipientAddress,
    date, 
    reason, 
    specificActions, 
    deadline, 
    consequences, 
    legalRights,
    sendViaMail
  } = validatedFields.data

  const letterContent = `
    ${date}

    Dear ${recipientName},

    This letter serves as a formal cease and desist notice from ${senderName}.

    Reason for this notice:
    ${reason}

    You are hereby directed to cease and desist the following actions:
    ${specificActions}

    Deadline for compliance: ${deadline}

    Consequences of non-compliance:
    ${consequences}

    Statement of legal rights:
    ${legalRights}

    Please comply with these demands by the specified deadline.

    Sincerely,
    ${senderName}
  `

  try {
    // Send via email
    await sendEmail({
      to: recipientEmail,
      from: senderEmail,
      subject: 'Cease and Desist Notice',
      body: letterContent
    })

    // Send via certified mail if requested
    if (sendViaMail) {
      await sendCertifiedMail({
        to: recipientAddress,
        from: senderName,
        content: letterContent
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to send cease and desist:', error)
    return { success: false, error: 'Failed to send cease and desist letter' }
  }
}

async function sendEmail({ to, from, subject, body }) {
  // Implement email sending logic here
  // This could use a service like SendGrid, Mailgun, or AWS SES
  console.log('Sending email:', { to, from, subject, body })
}

async function sendCertifiedMail({ to, from, content }) {
  // Implement certified mail sending logic here
  // This could integrate with a service like Lob or simply create a task for manual processing
  console.log('Sending certified mail:', { to, from, content })
}