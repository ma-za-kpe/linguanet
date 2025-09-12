import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePitchDeckPDF() {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Find the pitch container
  const pitchContainer = document.querySelector('.pitch-container');
  if (!pitchContainer) {
    console.error('Pitch container not found');
    generateSimplePitchPDF(); // Fallback to simple PDF
    return;
  }

  // Get the slide content area
  const slideContent = document.querySelector('.slide-content');
  if (!slideContent) {
    console.error('Slide content not found');
    generateSimplePitchPDF(); // Fallback to simple PDF
    return;
  }

  // Capture the entire pitch container with current slide
  try {
    const canvas = await html2canvas(pitchContainer as HTMLElement, {
      scale: 2,
      backgroundColor: '#0a0a0a',
      logging: false,
      useCORS: true,
      allowTaint: true,
      windowWidth: 1920,
      windowHeight: 1080
    });
    
    // Add to PDF
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 297; // A4 landscape width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, 210));
    
    // Save the PDF
    pdf.save('LinguaDAO_Pitch_Deck_Current_Slide.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    generateSimplePitchPDF(); // Fallback to simple PDF
  }
}

// Alternative: Generate a simplified PDF with text content
export function generateSimplePitchPDF() {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Add dark background for each page
  const addPageBackground = () => {
    pdf.setFillColor(10, 10, 10); // Dark background
    pdf.rect(0, 0, 210, 297, 'F');
  };

  // Title Page
  addPageBackground();
  
  // Add logo/branding area
  pdf.setFillColor(124, 58, 237); // Purple accent
  pdf.rect(0, 0, 210, 80, 'F');
  
  // Set fonts and colors
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(36);
  pdf.setTextColor(255, 255, 255); // White text
  
  pdf.text('LinguaDAO', 105, 35, { align: 'center' });
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text('The First Decentralized Language Preservation Protocol', 105, 50, { align: 'center' });
  
  // Add tagline
  pdf.setFontSize(14);
  pdf.setTextColor(34, 197, 94); // Green accent
  pdf.text('"The future of Africa speaks every language"', 105, 65, { align: 'center' });
  
  // Problem
  pdf.addPage();
  addPageBackground();
  
  // Add header bar
  pdf.setFillColor(124, 58, 237, 0.3);
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text('The Hidden Crisis', 105, 25, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  const problemText = [
    '• 3,000+ African languages at risk of extinction',
    '• 1 language dies every 14 days globally',
    '• 90% will vanish by 2100 without intervention',
    '• 50 years of charity has failed to stop the decline',
    '• AI models fail for 160M African speakers'
  ];
  let yPos = 60;
  problemText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 12;
  });
  
  // Add MIT research highlight
  pdf.setFillColor(255, 215, 0, 0.1);
  pdf.rect(15, 130, 180, 40, 'F');
  pdf.setTextColor(255, 215, 0);
  pdf.setFontSize(12);
  pdf.text('MIT Research: African languages perform 20% worse in AI models', 105, 145, { align: 'center' });
  pdf.text('This gap costs $2.8B in lost economic opportunity', 105, 155, { align: 'center' });

  // Solution
  pdf.addPage();
  addPageBackground();
  
  pdf.setFillColor(34, 197, 94, 0.3);
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Our Solution: Proof of Voice', 105, 25, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  const solutionText = [
    '✓ Proof of Voice consensus mechanism',
    '✓ Speakers earn $3-5 per voice recording',
    '✓ Voice Share NFTs with lifetime royalties',
    '✓ AI companies purchase verified datasets',
    '✓ Extinction Insurance pools protect languages'
  ];
  yPos = 60;
  solutionText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 12;
  });
  
  // Add revenue model highlight
  pdf.setFillColor(124, 58, 237, 0.2);
  pdf.rect(15, 130, 180, 50, 'F');
  pdf.setTextColor(124, 58, 237);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Revenue Distribution:', 30, 145);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(255, 255, 255);
  pdf.text('70% to Voice NFT holders | 20% to $LINGUA stakers | 10% to DAO', 105, 160, { align: 'center' });

  // Market Opportunity
  pdf.addPage();
  addPageBackground();
  
  pdf.setFillColor(255, 215, 0, 0.3);
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text('$12B Market Opportunity', 105, 25, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  const marketText = [
    '• $2.8B African AI market by 2027',
    '• 160M underserved speakers globally',
    '• $50B global AI training data market',
    '• MIT: 5.6% accuracy improvement worth billions',
    '• First mover advantage in Africa'
  ];
  yPos = 60;
  marketText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 12;
  });
  
  // Add TAM highlight
  pdf.setFillColor(255, 215, 0, 0.1);
  pdf.rect(15, 130, 180, 40, 'F');
  pdf.setTextColor(255, 215, 0);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('TAM: $12B by 2027', 105, 145, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.text('100K contributors Year 1 | 1M by Year 3', 105, 160, { align: 'center' });

  // Technology
  pdf.addPage();
  addPageBackground();
  
  pdf.setFillColor(34, 197, 94, 0.3);
  pdf.rect(0, 0, 210, 40, 'F');
  
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text('Technology Stack', 105, 25, { align: 'center' });
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(14);
  pdf.setTextColor(255, 255, 255);
  const techText = [
    '✓ Smart Contracts on Base L2 (Deployed)',
    '✓ IPFS for decentralized storage',
    '✓ AI validation with OpenAI Whisper',
    '✓ Web3Storage for permanent data',
    '✓ Mobile money integration (M-PESA ready)'
  ];
  yPos = 60;
  techText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 12;
  });
  
  // Add validation system
  pdf.setFillColor(124, 58, 237, 0.2);
  pdf.rect(15, 130, 180, 40, 'F');
  pdf.setTextColor(124, 58, 237);
  pdf.setFont('helvetica', 'bold');
  pdf.text('3-Tier Validation System:', 105, 145, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(255, 255, 255);
  pdf.text('AI → Community Consensus → IPFS Storage', 105, 160, { align: 'center' });

  // Business Model
  pdf.addPage();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Business Model', 20, 30);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  const businessText = [
    'Revenue Streams:',
    '• AI company data purchases ($1-3/clip)',
    '• Transaction fees (0.3% on AMM)',
    '• NFT marketplace royalties (2.5%)',
    '',
    'Revenue Distribution:',
    '• 70% to Voice NFT holders',
    '• 20% to $LINGUA stakers',
    '• 10% to DAO Treasury'
  ];
  yPos = 50;
  businessText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 8;
  });

  // Traction
  pdf.addPage();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Traction', 20, 30);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  const tractionText = [
    '• 5 smart contracts deployed on Base',
    '• Working MVP with recording interface',
    '• 4,287 Voice NFTs minted (testnet)',
    '• Partnership discussions with universities',
    '• MIT research validation'
  ];
  yPos = 50;
  tractionText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 10;
  });

  // Team
  pdf.addPage();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Team', 20, 30);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  const teamText = [
    'Maku Pauline Mazakpe',
    'Technical Co-founder, Startup Software Engineer',
    '• 5+ years software engineering',
    '• MEST alumnus',
    '• Former Farmerline Senior Mobile Developer',
    '',
    'Theophilus David Nana Yaw Kyei-Charway',
    'Blockchain Developer',
    '• Smart contract expertise',
    '• DeFi protocol development'
  ];
  yPos = 50;
  teamText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 8;
  });

  // Contact
  pdf.addPage();
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.text('Contact & Links', 20, 30);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  const contactText = [
    'Website: linguadao.africa',
    'Email: team@linguadao.africa',
    'Twitter: @LinguaDAO',
    'Demo: linguanetai.vercel.app',
    '',
    'Currently raising $2M seed round',
    'Building the future where Africa speaks every language'
  ];
  yPos = 50;
  contactText.forEach(line => {
    pdf.text(line, 20, yPos);
    yPos += 10;
  });

  // Save
  pdf.save('LinguaDAO_Pitch_Deck.pdf');
}