import DataForSEOTester from "@/components/dataforseo-tester"

export default function DataForSEOTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">DataForSEO API Testing Tool</h1>
      <p className="mb-6 text-muted-foreground">
        Use this tool to test different DataForSEO API endpoints and see what works with your account. Once you find
        working endpoints, you can use the generated code to implement them in your application.
      </p>
      <DataForSEOTester />
    </div>
  )
}
