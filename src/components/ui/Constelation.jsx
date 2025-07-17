import { useEffect, useRef } from 'react';

const ConstellationCanvas = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const connectionsRef = useRef([]);
  const animationRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Configuração inicial
    const resizeCanvas = () => {
      if (!isMountedRef.current || !canvas) return;
      
      try {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initStars();
      } catch (error) {
        console.error('Erro ao redimensionar canvas:', error);
      }
    };

    // Inicializa estrelas
    const initStars = () => {
      if (!isMountedRef.current || !canvas) return;
      
      const starCount = Math.floor(canvas.width * canvas.height / 5000); // Densidade proporcional
      starsRef.current = [];
      
      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.5,
          vx: Math.random() * 0.2 - 0.1,
          vy: Math.random() * 0.2 - 0.1
        });
      }
      
      createConnections();
    };

    // Cria conexões entre estrelas (constelações)
    const createConnections = () => {
      if (!isMountedRef.current) return;
      
      connectionsRef.current = [];
      const stars = starsRef.current;
      
      for (let i = 0; i < stars.length; i++) {
        // Cada estrela se conecta a 1-3 estrelas próximas
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        const connectedIndices = new Set();
        
        for (let j = 0; j < connectionCount; j++) {
          let closestIndex = -1;
          let closestDistance = Infinity;
          
          // Encontra estrela mais próxima não conectada
          for (let k = 0; k < stars.length; k++) {
            if (i === k || connectedIndices.has(k)) continue;
            
            const dx = stars[i].x - stars[k].x;
            const dy = stars[i].y - stars[k].y;
            const distance = dx * dx + dy * dy;
            
            if (distance < closestDistance && distance < (canvas.width * 0.2) ** 2) {
              closestDistance = distance;
              closestIndex = k;
            }
          }
          
          if (closestIndex !== -1) {
            connectedIndices.add(closestIndex);
            connectionsRef.current.push({
              from: i,
              to: closestIndex,
              alpha: Math.random() * 0.3 + 0.1
            });
          }
        }
      }
    };

    // Animação
    const animate = () => {
      if (!isMountedRef.current || !canvas || !ctx) return;
      
      try {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const stars = starsRef.current;
        
        // Atualiza posições
        stars.forEach(star => {
          star.x += star.vx;
          star.y += star.vy;
          
          // Mantém as estrelas dentro do canvas
          if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
          if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
        });
        
        // Desenha conexões
        ctx.strokeStyle = 'rgba(45, 212, 191, 0.09)';
        connectionsRef.current.forEach(conn => {
          const from = stars[conn.from];
          const to = stars[conn.to];
          
          if (from && to) {
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
          }
        });
        
        // Desenha estrelas
        stars.forEach(star => {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, 0.09)`;
          ctx.fill();
        });
        
        if (isMountedRef.current) {
          animationRef.current = requestAnimationFrame(animate);
        }
      } catch (error) {
        console.error('Erro na animação:', error);
      }
    };

    // Inicialização
    try {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      animate();
    } catch (error) {
      console.error('Erro na inicialização do canvas:', error);
    }

    // Limpeza
    return () => {
      isMountedRef.current = false;
      try {
        window.removeEventListener('resize', resizeCanvas);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } catch (error) {
        console.error('Erro na limpeza do canvas:', error);
      }
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full absolute inset-0 pointer-events-none"
    />
  );
};

export default ConstellationCanvas;