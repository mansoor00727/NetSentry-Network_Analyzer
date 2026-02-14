import { useForm } from "react-hook-form"
import { motion } from "motion/react"
import { Mail, MapPin, Phone, Github, Twitter, Linkedin, Send } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { toast } from "sonner"

type FormData = {
  name: string
  email: string
  subject: string
  message: string
}

export function Contact() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log(data)
    toast.success("Message sent successfully!")
    reset()
  }

  return (
    <div className="w-full py-12 md:py-24 lg:py-32 bg-background min-h-screen">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Get in Touch</h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Have questions about enterprise deployment or custom integrations? Our team is ready to help.
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Email Us</h3>
                  <p className="text-sm text-muted-foreground">support@netsentry.io</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Call Us</h3>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Visit Us</h3>
                  <p className="text-sm text-muted-foreground">101 Tech Blvd, San Francisco, CA 94107</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        {...register("name", { required: true })} 
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <span className="text-xs text-red-500">Name is required</span>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        {...register("email", { required: true, pattern: /^\S+@\S+$/i })} 
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <span className="text-xs text-red-500">Valid email is required</span>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="Enterprise Inquiry" 
                      {...register("subject", { required: true })}
                      className={errors.subject ? "border-red-500" : ""}
                    />
                    {errors.subject && <span className="text-xs text-red-500">Subject is required</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your project..." 
                      className={`min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
                      {...register("message", { required: true })}
                    />
                    {errors.message && <span className="text-xs text-red-500">Message is required</span>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
