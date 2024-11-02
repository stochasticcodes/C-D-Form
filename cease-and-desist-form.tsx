'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { sendCeaseAndDesist } from './actions'

export default function CeaseAndDesistForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sendViaMail, setSendViaMail] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    formData.append('sendViaMail', sendViaMail.toString())
    
    try {
      const result = await sendCeaseAndDesist(formData)
      if (result.success) {
        setSuccess(true)
        router.push('/success') // Redirect to a success page
      } else {
        setError(result.error || 'An unknown error occurred')
      }
    } catch (e) {
      setError('An error occurred while sending the cease and desist letter')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Alert>
        <AlertTitle>Success!</AlertTitle>
        <AlertDescription>Your cease and desist letter has been sent successfully via email{sendViaMail ? ' and will be sent via certified mail' : ''}.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Send a Cease and Desist Letter</CardTitle>
        <CardDescription>Fill out this form to create and send a cease and desist letter. We'll handle the legal language for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Information</h3>
            <div>
              <Label htmlFor="senderName">Your Name</Label>
              <Input id="senderName" name="senderName" required />
            </div>
            <div>
              <Label htmlFor="senderEmail">Your Email</Label>
              <Input id="senderEmail" name="senderEmail" type="email" required />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Recipient Information</h3>
            <div>
              <Label htmlFor="recipientName">Recipient's Name</Label>
              <Input id="recipientName" name="recipientName" required />
            </div>
            <div>
              <Label htmlFor="recipientEmail">Recipient's Email</Label>
              <Input id="recipientEmail" name="recipientEmail" type="email" required />
            </div>
            <div>
              <Label htmlFor="recipientAddress">Recipient's Mailing Address</Label>
              <Textarea id="recipientAddress" name="recipientAddress" required />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cease and Desist Details</h3>
            <div>
              <Label htmlFor="issue">What is the issue?</Label>
              <Textarea 
                id="issue" 
                name="issue" 
                placeholder="Describe what the recipient is doing that you want them to stop. Be specific." 
                required 
              />
            </div>
            <div>
              <Label htmlFor="desiredAction">What do you want them to do?</Label>
              <Textarea 
                id="desiredAction" 
                name="desiredAction" 
                placeholder="Explain what actions you want the recipient to take. For example, 'Stop using my copyrighted images' or 'Cease contact with me immediately'." 
                required 
              />
            </div>
            <div>
              <Label htmlFor="deadline">By when do you want them to comply?</Label>
              <Input id="deadline" name="deadline" type="date" required />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="sendViaMail" 
              checked={sendViaMail} 
              onCheckedChange={(checked) => setSendViaMail(checked as boolean)}
            />
            <Label htmlFor="sendViaMail">Also send via certified mail (additional fees may apply)</Label>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Sending...' : 'Send Cease and Desist Letter'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          This service provides a general cease and desist letter. For complex legal matters, please consult with a lawyer.
        </p>
      </CardFooter>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </Card>
  )
}