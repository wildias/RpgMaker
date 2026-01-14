import { useState, useRef } from 'react';
import '../styles/ImageCropper.css';

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleSave = () => {
    if (!containerRef.current || !imageRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Tamanho final do canvas
    const outputSize = 160;
    canvas.width = outputSize;
    canvas.height = outputSize;

    // Obter dimensões do container
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // Área de crop no centro do container (160x160)
    const cropSize = 160;
    const cropLeft = (containerWidth - cropSize) / 2;
    const cropTop = (containerHeight - cropSize) / 2;

    // Obter imagem original
    const img = imageRef.current;
    const imgNaturalWidth = img.naturalWidth;
    const imgNaturalHeight = img.naturalHeight;

    // Calcular o tamanho da imagem renderizada no container
    // A imagem usa object-fit: contain, então preciso calcular como ela se encaixa
    const imgAspect = imgNaturalWidth / imgNaturalHeight;
    const containerAspect = containerWidth / containerHeight;
    
    let renderedWidth, renderedHeight;
    if (imgAspect > containerAspect) {
      // Imagem mais larga que o container
      renderedWidth = containerWidth;
      renderedHeight = containerWidth / imgAspect;
    } else {
      // Imagem mais alta que o container
      renderedHeight = containerHeight;
      renderedWidth = containerHeight * imgAspect;
    }

    // Aplicar o scale
    renderedWidth *= scale;
    renderedHeight *= scale;

    // Calcular a posição inicial da imagem (antes de aplicar position)
    const imgLeft = (containerWidth - renderedWidth) / 2 + position.x;
    const imgTop = (containerHeight - renderedHeight) / 2 + position.y;

    // Calcular qual parte da imagem está visível na área de crop
    const cropRelativeToImg = {
      left: cropLeft - imgLeft,
      top: cropTop - imgTop,
    };

    // Converter para coordenadas da imagem original
    const scaleToOriginal = imgNaturalWidth / renderedWidth;
    const sourceX = cropRelativeToImg.left * scaleToOriginal;
    const sourceY = cropRelativeToImg.top * scaleToOriginal;
    const sourceWidth = cropSize * scaleToOriginal;
    const sourceHeight = cropSize * scaleToOriginal;

    // Desenhar no canvas
    ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      0, 0, outputSize, outputSize
    );

    // Converter para base64
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedImage);
  };

  return (
    <div className="image-cropper-overlay">
      <div className="image-cropper-modal">
        <div className="cropper-header">
          <h3>Ajustar Imagem</h3>
          <button className="close-btn" onClick={onCancel}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="cropper-body">
          <div
            ref={containerRef}
            className="crop-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              ref={imageRef}
              src={image}
              alt="Crop"
              className="crop-image"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: isDragging ? 'grabbing' : 'grab',
              }}
              draggable={false}
            />
            <div className="crop-overlay"></div>
          </div>

          <div className="cropper-instructions">
            <p>🖱️ Arraste para mover | 🔍 Use os botões para ajustar o zoom</p>
          </div>
        </div>

        <div className="cropper-controls">
          <div className="zoom-controls">
            <button onClick={handleZoomOut} className="control-btn" title="Diminuir zoom">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="7" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <span className="zoom-value">{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomIn} className="control-btn" title="Aumentar zoom">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                <line x1="7" y1="11" x2="15" y2="11" stroke="currentColor" strokeWidth="2"/>
                <line x1="11" y1="7" x2="11" y2="15" stroke="currentColor" strokeWidth="2"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
          </div>

          <div className="action-buttons">
            <button onClick={handleReset} className="btn-reset">
              Resetar
            </button>
            <button onClick={onCancel} className="btn-cancel">
              Cancelar
            </button>
            <button onClick={handleSave} className="btn-save">
              Aplicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
