import { Component, ElementRef, ViewChild, Input, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pattern-lock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pattern-lock-container">
      <canvas #patternCanvas 
              (mousedown)="startDrawing($event)"
              (mousemove)="draw($event)"
              (mouseup)="endDrawing()"
              (mouseleave)="endDrawing()"
              (touchstart)="startDrawing($event)"
              (touchmove)="draw($event)"
              (touchend)="endDrawing()">
      </canvas>
      <div class="pattern-status">{{ statusMessage }}</div>
    </div>
  `,
  styles: [`
    .pattern-lock-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    canvas {
      border: 1px solid #ccc;
      border-radius: 8px;
      touch-action: none;
    }
    .pattern-status {
      margin-top: 10px;
      color: #666;
    }
  `]
})
export class PatternLockComponent {
  @ViewChild('patternCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  mode: 'set' | 'validate';
  correctPattern: number[];

  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private dots: { x: number; y: number }[] = [];
  private selectedDots: number[] = [];
  statusMessage = 'Draw your pattern';

  constructor(
    public dialogRef: MatDialogRef<PatternLockComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'set' | 'validate'; correctPattern: number[] }
  ) {
    this.mode = data.mode;
    this.correctPattern = data.correctPattern || [];
    this.statusMessage = this.mode === 'set' ? 'Draw your pattern to set it.' : 'Draw your pattern to unlock.';
  }

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = 300;
    canvas.height = 300;
    this.initializeDots();
    this.drawDots();
  }

  private initializeDots() {
    const canvas = this.canvasRef.nativeElement;
    const padding = 50;
    const spacing = (canvas.width - 2 * padding) / 2;
    
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        this.dots.push({
          x: padding + col * spacing,
          y: padding + row * spacing
        });
      }
    }
  }

  private drawDots() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    
    // Draw dots
    this.dots.forEach((dot, index) => {
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, 10, 0, Math.PI * 2);
      this.ctx.fillStyle = this.selectedDots.includes(index) ? '#4CAF50' : '#666';
      this.ctx.fill();
      this.ctx.closePath();
    });

    // Draw lines
    if (this.selectedDots.length > 1) {
      this.ctx.beginPath();
      this.ctx.moveTo(this.dots[this.selectedDots[0]].x, this.dots[this.selectedDots[0]].y);
      
      for (let i = 1; i < this.selectedDots.length; i++) {
        this.ctx.lineTo(this.dots[this.selectedDots[i]].x, this.dots[this.selectedDots[i]].y);
      }
      
      this.ctx.strokeStyle = '#4CAF50';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }

  private getDotIndex(x: number, y: number): number | null {
    const threshold = 20;
    return this.dots.findIndex(dot => 
      Math.abs(dot.x - x) < threshold && Math.abs(dot.y - y) < threshold
    );
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    const coords = this.getCoordinates(event);
    const dotIndex = this.getDotIndex(coords.x, coords.y);
    
    if (dotIndex !== null && !this.selectedDots.includes(dotIndex)) {
      this.selectedDots.push(dotIndex);
      this.drawDots();
    }
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    
    const coords = this.getCoordinates(event);
    const dotIndex = this.getDotIndex(coords.x, coords.y);
    
    if (dotIndex !== null && !this.selectedDots.includes(dotIndex)) {
      this.selectedDots.push(dotIndex);
      this.drawDots();
    }
  }

  endDrawing() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.validatePattern();
    }
  }

  private validatePattern() {
    if (this.mode === 'set') {
      if (this.selectedDots.length > 0) {
        this.statusMessage = 'Pattern set!';
        this.dialogRef.close({ pattern: this.selectedDots, isValid: true });
      } else {
        this.statusMessage = 'Please draw a pattern.';
        this.dialogRef.close({ pattern: null, isValid: false });
      }
    } else {
      const isCorrect = this.selectedDots.length === this.correctPattern.length &&
        this.selectedDots.every((dot, index) => dot === this.correctPattern[index]);

      if (isCorrect) {
        this.statusMessage = 'Pattern correct!';
        this.dialogRef.close({ isValid: true });
      } else {
        this.statusMessage = 'Incorrect pattern, try again';
        this.dialogRef.close({ isValid: false });
      }
    }

    setTimeout(() => {
      this.selectedDots = [];
      this.drawDots();
      this.statusMessage = this.mode === 'set' ? 'Draw your pattern to set it.' : 'Draw your pattern to unlock.';
    }, 1000);
  }

  private getCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    
    if (event instanceof MouseEvent) {
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    } else {
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    }
  }
} 