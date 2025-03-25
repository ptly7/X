// Create PNG icons manually since svg2png-cli had issues
// This JavaScript file will create canvas elements and draw our icon at different sizes

// Function to create icons at different sizes
function createIcons() {
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  
  sizes.forEach(size => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = '#3A86FF';
    ctx.beginPath();
    const radius = size * 0.2; // 20% of size for rounded corners
    ctx.moveTo(size - radius, 0);
    ctx.arcTo(size, 0, size, radius, radius);
    ctx.arcTo(size, size, size - radius, size, radius);
    ctx.arcTo(0, size, 0, size - radius, radius);
    ctx.arcTo(0, 0, radius, 0, radius);
    ctx.arcTo(size, 0, size, radius, radius);
    ctx.fill();
    
    // Draw outer circle
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.35, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw inner circle (hollow)
    ctx.fillStyle = '#3A86FF';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.25, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw middle ring
    ctx.fillStyle = '#FF9E00';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw inner circle
    ctx.fillStyle = '#3A86FF';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw center dot
    ctx.fillStyle = '#FF006E';
    ctx.beginPath();
    ctx.arc(size/2, size/2, size * 0.05, 0, Math.PI * 2);
    ctx.fill();
    
    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // Create download link
    const link = document.createElement('a');
    link.download = `icon-${size}x${size}.png`;
    link.href = dataUrl;
    link.textContent = `Download ${size}x${size} icon`;
    
    // Add to document
    document.body.appendChild(link);
    document.body.appendChild(document.createElement('br'));
  });
  
  console.log('Icons created! Click the links to download.');
}

// Call the function when the page loads
window.onload = createIcons;
