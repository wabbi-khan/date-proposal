import { useEffect, useRef } from "react";

export default function FloatingHearts({ resetKey }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 12 + 8;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = -(Math.random() * 2 + 1);
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `hsl(${Math.random() * 30 + 340}, 100%, ${Math.random() * 20 + 70}%)`;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.02 - 0.01;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.angle += this.spin;
        if (this.y < -20) {
          this.y = canvas.height + 20;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          -this.size / 2,
          -this.size / 2,
          -this.size,
          this.size / 3,
          0,
          this.size,
        );
        ctx.bezierCurveTo(
          this.size,
          this.size / 3,
          this.size / 2,
          -this.size / 2,
          0,
          0,
        );
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < 40; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resetKey]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
