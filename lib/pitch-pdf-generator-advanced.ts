import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PitchSlide {
  title: string;
  [key: string]: unknown;
}

export async function generateFullPitchDeckPDF(
  currentSlideIndex: number,
  setCurrentSlide: (index: number) => void,
  pitchSlidesData: PitchSlide[]
) {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Show loading indicator
  const loadingDiv = document.createElement('div');
  loadingDiv.innerHTML = 'Generating PDF... Please wait';
  loadingDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(124, 58, 237, 0.9);
    color: white;
    padding: 20px 40px;
    border-radius: 12px;
    font-size: 18px;
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  document.body.appendChild(loadingDiv);

  try {
    // Store the current slide index to restore later
    const originalSlideIndex = currentSlideIndex;

    // Iterate through all slides
    for (let i = 0; i < pitchSlidesData.length; i++) {
      // Update loading message
      loadingDiv.innerHTML = `Generating PDF... Slide ${i + 1} of ${pitchSlidesData.length}`;
      
      // Navigate to this slide
      setCurrentSlide(i);
      
      // Wait longer for animation to complete and content to fully render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find the entire pitch container to capture with background
      const pitchContainer = document.querySelector('.pitch-container');
      if (!pitchContainer) continue;
      
      // Capture the entire pitch container with background
      const canvas = await html2canvas(pitchContainer as HTMLElement, {
        scale: 2,
        backgroundColor: '#0a0a0a',
        logging: false,
        useCORS: true,
        allowTaint: true,
        windowWidth: 1920,
        windowHeight: 1080,
        imageTimeout: 0,
        ignoreElements: (element) => {
          // Ignore elements that shouldn't be in the PDF
          return element.classList?.contains('navigation') ||
                 element.classList?.contains('action-buttons') ||
                 element.classList?.contains('keyboard-hints') ||
                 element.classList?.contains('slide-counter') ||
                 element.classList?.contains('progress-bar');
        },
        onclone: (clonedDoc) => {
          // Ensure the cloned element has the right styles
          const clonedContainer = clonedDoc.querySelector('.pitch-container') as HTMLElement;
          if (clonedContainer) {
            // Set exact background gradient
            clonedContainer.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a0f2e 100%)';
            clonedContainer.style.width = '1920px';
            clonedContainer.style.height = '1080px';
            clonedContainer.style.position = 'relative';
            clonedContainer.style.overflow = 'hidden';
            
            // Fix the slide title to have clean styling
            const slideTitle = clonedContainer.querySelector('.slide-title') as HTMLElement;
            if (slideTitle) {
              // Keep the gradient but make it render properly
              slideTitle.style.fontSize = '48px';
              slideTitle.style.fontWeight = '700';
              slideTitle.style.marginBottom = '40px';
              slideTitle.style.textAlign = 'center';
              slideTitle.style.color = '#ffffff';
              // Remove text gradient for PDF
              slideTitle.style.background = 'none';
              slideTitle.style.webkitBackgroundClip = 'unset';
              slideTitle.style.webkitTextFillColor = 'unset';
              slideTitle.style.backgroundClip = 'unset';
            }
            
            // Preserve specific colored elements
            const bigNumbers = clonedContainer.querySelectorAll('.big-number');
            bigNumbers.forEach((el: Element) => {
              (el as HTMLElement).style.color = '#ef4444';
            });
            
            const speakers = clonedContainer.querySelectorAll('.speakers');
            speakers.forEach((el: Element) => {
              (el as HTMLElement).style.color = '#ffffff';
            });
            
            const declines = clonedContainer.querySelectorAll('.decline');
            declines.forEach((el: Element) => {
              (el as HTMLElement).style.color = '#ef4444';
            });
            
            const emotionalHooks = clonedContainer.querySelectorAll('.emotional-hook');
            emotionalHooks.forEach((el: Element) => {
              (el as HTMLElement).style.color = '#e5e5e7';
            });
            
            // Fix metric values
            const metricValues = clonedContainer.querySelectorAll('.metric-value');
            metricValues.forEach((el: Element) => {
              (el as HTMLElement).style.color = '#22c55e';
            });
            
            // Ensure all text elements are visible (but only if not already colored)
            const allText = clonedContainer.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');
            allText.forEach((el: Element) => {
              const element = el as HTMLElement;
              const computedStyle = window.getComputedStyle(element);
              if (!element.style.color && (computedStyle.color === 'transparent' || computedStyle.color === 'rgba(0, 0, 0, 0)')) {
                element.style.color = '#ffffff';
              }
            });
            
            // Fix gradient texts
            const gradientTexts = clonedContainer.querySelectorAll('.gradient-text');
            gradientTexts.forEach((el: Element) => {
              const element = el as HTMLElement;
              element.style.background = 'none';
              element.style.webkitBackgroundClip = 'unset';
              element.style.webkitTextFillColor = 'unset';
              element.style.color = '#7c3aed';
            });
            
            // Ensure cards and boxes have proper backgrounds
            const cards = clonedContainer.querySelectorAll('.problem-card, .innovation-card, .team-member, .partner-type');
            cards.forEach((card: Element) => {
              const element = card as HTMLElement;
              if (!element.style.background || element.style.background === 'none') {
                element.style.background = 'rgba(26, 26, 26, 0.9)';
                element.style.border = '1px solid rgba(124, 58, 237, 0.3)';
              }
            });
            
            // Hide UI elements
            const elementsToHide = ['.navigation', '.action-buttons', '.keyboard-hints', '.slide-counter', '.progress-bar', '.swipe-indicator'];
            elementsToHide.forEach(selector => {
              const element = clonedContainer.querySelector(selector) as HTMLElement;
              if (element) element.style.display = 'none';
            });
          }
        }
      });
      
      // Add page to PDF
      if (i > 0) {
        pdf.addPage();
      }
      
      // Add the captured image (no background fill needed as the image has the background)
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Calculate position to fit the image properly
      let finalWidth = imgWidth;
      let finalHeight = imgHeight;
      
      // If image is too tall, scale it down
      if (imgHeight > 210) {
        finalHeight = 210;
        finalWidth = (canvas.width * finalHeight) / canvas.height;
      }
      
      // Center the image on the page
      const xOffset = Math.max(0, (297 - finalWidth) / 2);
      const yOffset = Math.max(0, (210 - finalHeight) / 2);
      
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
    }
    
    // Restore the original slide
    setCurrentSlide(originalSlideIndex);
    
    // Save the PDF
    pdf.save('LinguaDAO_Pitch_Deck_Complete.pdf');
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    // Remove loading indicator
    document.body.removeChild(loadingDiv);
  }
}