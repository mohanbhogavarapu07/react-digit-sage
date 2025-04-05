import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartTooltip, Legend, LineChart, Line } from 'recharts';
import { Calculator, Download, Mail, TrendingUp, DollarSign, Percent, Users, PieChart, Briefcase, MapPin, Building2, Scale } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CalculatorLayout } from '@/layouts/CalculatorLayout';

interface CalculatorValues {
  currentSalary: number;
  experience: number;
  role: string;
  location: string;
  industry: string;
  companySize: string;
  education: string;
  skills: string[];
}

interface SalaryData {
  role: string;
  location: string;
  industry: string;
  experience: number;
  baseSalary: number;
  bonus: number;
  benefits: number;
  marketAverage: number;
  percentile: number;
}

interface BenchmarkData {
  role: string;
  location: string;
  industry: string;
  companySize: string;
  education: string;
  salary: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

const SalaryBenchmarkingCalculator: React.FC = () => {
  const { toast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);
  
  const [values, setValues] = useState<CalculatorValues>({
    currentSalary: 1000000,
    experience: 5,
    role: 'Software Engineer',
    location: 'Bangalore',
    industry: 'Technology',
    companySize: 'Large',
    education: 'Bachelor\'s',
    skills: ['JavaScript', 'React', 'Node.js']
  });
  
  const [salaryData, setSalaryData] = useState<SalaryData>({
    role: 'Software Engineer',
    location: 'Bangalore',
    industry: 'Technology',
    experience: 5,
    baseSalary: 1500000,
    bonus: 200000,
    benefits: 100000,
    marketAverage: 0,
    percentile: 0
  });
  
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    calculateResults();
  }, [values]);
  
  const calculateResults = () => {
    // Mock calculation logic
    const totalCompensation = salaryData.baseSalary + salaryData.bonus + salaryData.benefits;
    const marketAverage = totalCompensation * 0.9; // Example calculation
    const percentile = 75; // Example calculation
    
    setSalaryData({
      ...salaryData,
      marketAverage,
      percentile
    });
    
    setChartData([
      { name: 'Your Offer', value: totalCompensation },
      { name: 'Market Average', value: marketAverage }
    ]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: name === 'currentSalary' || name === 'experience' ? parseFloat(value) || 0 : value
    });
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value
    });
  };
  
  const generatePDF = async () => {
    if (!resultRef.current) return;
    
    try {
      toast({
        title: "Preparing your PDF...",
        description: "Please wait while we generate your report.",
      });
      
      const canvas = await html2canvas(resultRef.current, {
        width: resultRef.current.scrollWidth * 2,
        height: resultRef.current.scrollHeight * 2,
        logging: false,
        useCORS: true,
        background: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add branded header
      pdf.setFillColor(36, 94, 79); // dark green
      pdf.rect(0, 0, 210, 25, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text('Retail Insights Visualizer', 105, 15, { align: 'center' });
      
      // Add report title
      pdf.setTextColor(36, 94, 79);
      pdf.setFontSize(20);
      pdf.text('Salary Benchmarking Analysis', 105, 40, { align: 'center' });
      
      // Add date
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 105, 50, { align: 'center' });
      
      // Add image of results
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 15, 60, imgWidth, imgHeight);
      
      // Add footer
      pdf.setFillColor(36, 94, 79);
      pdf.rect(0, 282, 210, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text('© 2023 Retail Insights Visualizer | www.retailinsights.com', 105, 290, { align: 'center' });
      
      pdf.save('salary-benchmarking-analysis.pdf');
      
      toast({
        title: "PDF Downloaded Successfully",
        description: "Your salary benchmarking analysis has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "There was an error generating your PDF. Please try again.",
      });
    }
  };
  
  const sendEmail = () => {
    toast({
      title: "Email Feature",
      description: "This would integrate with your email service to send the report. For now, please use the download option.",
    });
  };

  return (
    <CalculatorLayout
      title="Salary Benchmarking Calculator"
      description="Compare salaries across roles and regions"
      activeTab="hr-people-ops"
      activeSubTab="salary-benchmarking"
      icon={<DollarSign className="h-6 w-6" />}
    >
      <div className="w-full max-w-6xl mx-auto p-4 animate-fade-in">
        <Card className="calculator-card">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="role" className="text-sm font-medium mb-1 block">
                  Role
                </Label>
                <Input
                  id="role"
                  name="role"
                  value={salaryData.role}
                  onChange={handleInputChange}
                  className="w-full border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="location" className="text-sm font-medium mb-1 block">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={salaryData.location}
                  onChange={handleInputChange}
                  className="w-full border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="industry" className="text-sm font-medium mb-1 block">
                  Industry
                </Label>
                <Input
                  id="industry"
                  name="industry"
                  value={salaryData.industry}
                  onChange={handleInputChange}
                  className="w-full border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="experience" className="text-sm font-medium mb-1 block">
                  Years of Experience
                </Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={salaryData.experience}
                  onChange={handleInputChange}
                  className="w-full border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="baseSalary" className="text-sm font-medium mb-1 block">
                  Base Salary (₹)
                </Label>
                <Input
                  id="baseSalary"
                  name="baseSalary"
                  type="number"
                  value={salaryData.baseSalary}
                  onChange={handleInputChange}
                  className="w-full border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="bonus" className="text-sm font-medium mb-1 block">
                  Bonus (₹)
                </Label>
                <Input
                  id="bonus"
                  name="bonus"
                  type="number"
                  value={salaryData.bonus}
                  onChange={handleInputChange}
                  className="w-full border-gray-300"
                />
              </div>
              
              <div>
                <Label htmlFor="benefits" className="text-sm font-medium mb-1 block">
                  Benefits (₹)
                </Label>
                <Input
                  id="benefits"
                  name="benefits"
                  type="number"
                  value={salaryData.benefits}
                  onChange={handleInputChange}
                  className="w-full border-gray-300"
                />
              </div>
            </div>
            
            <div ref={resultRef} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-blue-700" />
                      <h3 className="text-lg font-semibold text-blue-800">Market Average</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-700">₹{salaryData.marketAverage.toLocaleString()}</p>
                    <p className="text-sm text-blue-600 mt-2">Average salary for this role</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="h-5 w-5 text-purple-700" />
                      <h3 className="text-lg font-semibold text-purple-800">Percentile</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-700">{salaryData.percentile}%</p>
                    <p className="text-sm text-purple-600 mt-2">Your position in the market</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-finance-green" />
                  Salary Comparison
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartTooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#4F46E5" name="Salary" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-6 bg-gray-50 rounded-b-xl">
            <div className="flex gap-4">
              <Button onClick={generatePDF} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              <Button onClick={sendEmail} variant="outline" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Report
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </CalculatorLayout>
  );
};

export default SalaryBenchmarkingCalculator; 