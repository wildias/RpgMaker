import { useState, useEffect } from 'react';
import type { PersonagemResponse } from '../types/types';
import ImageCropper from './ImageCropper';
import '../styles/PersonagemModal.css';
import '../styles/PersonagemModalMobile.css';

interface PersonagemModalProps {
  isOpen: boolean;
  onClose: () => void;
  personagem?: PersonagemResponse | null;
  mode: 'create' | 'view' | 'edit';
  onSave?: (data: any) => void;
}

// Função para garantir que a imagem base64 tenha o formato correto
const formatImageSrc = (imageData: string | null | undefined): string | null => {
  if (!imageData || imageData.trim() === '') return null;
  
  // Se já tem o prefixo data:image, retorna como está
  if (imageData.startsWith('data:image')) {
    return imageData;
  }
  
  // Se for apenas a string base64, adiciona o prefixo
  return `data:image/jpeg;base64,${imageData}`;
};

export default function PersonagemModal({ isOpen, onClose, personagem, mode, onSave }: PersonagemModalProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    numeroIdentificacao: '',
    idade: 0,
    reino: '',
    aptidao: '',
    nivel: 0,
    pxAtual: 0,
    pxTotal: 0,
    vigor: Array(10).fill(false),
    essencia: Array(10).fill(false),
    limiteSupressao: Array(5).fill(false),
    potencia: Array(5).fill(false),
    agilidade: Array(5).fill(false),
    vontade: Array(5).fill(false),
    engenho: Array(5).fill(false),
    presenca: Array(5).fill(false),
    pontosDeVida: 0,
    pontosDeVidaMaximos: 0,
    manifestacaoMagica: '',
    historia: '',
    equipamento: '',
    imagem: ''
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [initialFormData, setInitialFormData] = useState<any>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Detectar mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (personagem) {
      // Parsear a ficha JSON se existir
      let fichaData: any = {
        EstadoVital: {
          Vigor: Array(10).fill(false),
          Essencia: Array(10).fill(false),
          LimiteSupressao: Array(5).fill(false),
        },
        Atributos: {
          Potencia: Array(5).fill(false),
          Agilidade: Array(5).fill(false),
          Vontade: Array(5).fill(false),
          Engenho: Array(5).fill(false),
          Presenca: Array(5).fill(false),
        },
        EquipamentosPosses: '',
        ManifestacaoMagica: '',
        Historia: '',
      };

      if (personagem.ficha) {
        try {
          fichaData = JSON.parse(personagem.ficha);
        } catch (e) {
          console.error('Erro ao parsear ficha:', e);
        }
      }

      const loadedData = {
        nome: personagem.nome || '',
        numeroIdentificacao: personagem.numeroIdentificacao?.toString() || '',
        idade: personagem.idade || 0,
        reino: personagem.reino || '',
        aptidao: personagem.aptidao || '',
        nivel: personagem.level || 0,
        pxAtual: personagem.pX_Atual || 0,
        pxTotal: personagem.pX_Total || 0,
        vigor: fichaData.EstadoVital?.Vigor || Array(10).fill(false),
        essencia: fichaData.EstadoVital?.Essencia || Array(10).fill(false),
        limiteSupressao: fichaData.EstadoVital?.LimiteSupressao || Array(5).fill(false),
        potencia: fichaData.Atributos?.Potencia || Array(5).fill(false),
        agilidade: fichaData.Atributos?.Agilidade || Array(5).fill(false),
        vontade: fichaData.Atributos?.Vontade || Array(5).fill(false),
        engenho: fichaData.Atributos?.Engenho || Array(5).fill(false),
        presenca: fichaData.Atributos?.Presenca || Array(5).fill(false),
        pontosDeVida: 0,
        pontosDeVidaMaximos: 0,
        manifestacaoMagica: fichaData.ManifestacaoMagica || '',
        historia: fichaData.Historia || '',
        equipamento: fichaData.EquipamentosPosses || '',
        imagem: personagem.imagem || ''
      };

      setFormData(loadedData);
      setInitialFormData(JSON.parse(JSON.stringify(loadedData)));
      setPreviewImage(personagem.imagem || null);
      setHasChanges(false);
    } else {
      // Modo criar - resetar tudo
      const emptyData = {
        nome: '',
        numeroIdentificacao: '',
        idade: 0,
        reino: '',
        aptidao: '',
        nivel: 0,
        pxAtual: 0,
        pxTotal: 0,
        vigor: Array(10).fill(false),
        essencia: Array(10).fill(false),
        limiteSupressao: Array(5).fill(false),
        potencia: Array(5).fill(false),
        agilidade: Array(5).fill(false),
        vontade: Array(5).fill(false),
        engenho: Array(5).fill(false),
        presenca: Array(5).fill(false),
        pontosDeVida: 0,
        pontosDeVidaMaximos: 0,
        manifestacaoMagica: '',
        historia: '',
        equipamento: '',
        imagem: ''
      };
      setFormData(emptyData);
      setInitialFormData(null);
      setPreviewImage(null);
      setHasChanges(false);
    }
  }, [personagem]);

  // Detectar mudanças comparando formData com initialFormData
  useEffect(() => {
    if (initialFormData && mode === 'edit') {
      const changed = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasChanges(changed);
    }
  }, [formData, initialFormData, mode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['nivel', 'pontosDeVida', 'pontosDeVidaMaximos', 'forca', 'destreza', 'constituicao', 'inteligencia', 'sabedoria', 'carisma', 'idade', 'pxAtual', 'pxTotal'].includes(name)
        ? parseInt(value) || 0
        : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setPreviewImage(croppedImage);
    setFormData(prev => ({ ...prev, imagem: croppedImage }));
    setShowCropper(false);
    setTempImage(null);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  const toggleEstadoVital = (tipo: 'vigor' | 'essencia' | 'limiteSupressao', index: number) => {
    if (isReadOnly) return;
    setFormData(prev => {
      const currentArray = prev[tipo];
      const isCurrentlyFilled = currentArray[index];
      
      // Se estiver preenchido, remove este e todos os posteriores (mantém anteriores)
      if (isCurrentlyFilled) {
        return {
          ...prev,
          [tipo]: currentArray.map((val: boolean, i: number) => i < index ? val : false)
        };
      } else {
        // Se não estiver preenchido, preenche este e todos os anteriores
        return {
          ...prev,
          [tipo]: currentArray.map((val: boolean, i: number) => i <= index ? true : val)
        };
      }
    });
  };

  const toggleAtributo = (tipo: 'potencia' | 'agilidade' | 'vontade' | 'engenho' | 'presenca', index: number) => {
    if (isReadOnly) return;
    setFormData(prev => {
      const currentArray = prev[tipo];
      const isCurrentlyFilled = currentArray[index];
      
      // Se estiver preenchido, remove este e todos os posteriores (mantém anteriores)
      if (isCurrentlyFilled) {
        return {
          ...prev,
          [tipo]: currentArray.map((val: boolean, i: number) => i < index ? val : false)
        };
      } else {
        // Se não estiver preenchido, preenche este e todos os anteriores
        return {
          ...prev,
          [tipo]: currentArray.map((val: boolean, i: number) => i <= index ? true : val)
        };
      }
    });
  };

  const isReadOnly = mode === 'view';

  if (!isOpen) return null;

  return (
    <>
      {showCropper && tempImage && (
        <ImageCropper
          image={tempImage}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}
      <div className={`modal-overlay ${isMobile ? 'modal-mobile' : ''}`} onClick={onClose}>
      <div className="modal-content ficha-rpg" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} title="Fechar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isMobile ? (
          // LAYOUT MOBILE
          <form onSubmit={handleSubmit} className="ficha-form">
            {/* Linha 1: Imagem + Level/PX */}
            <div className="mobile-top-row">
              <div className="image-container">
                <input
                  type="file"
                  id="personagem-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isReadOnly}
                  style={{ display: 'none' }}
                />
                <label htmlFor="personagem-image" className={`image-upload-box ${isReadOnly ? 'readonly' : ''}`}>
                  {previewImage ? (
                    <img src={formatImageSrc(previewImage) || previewImage} alt="Personagem" className="preview-image" />
                  ) : (
                    <div className="image-placeholder">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      <span>Selecionar Imagem</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="level-px-container">
                <div className="level-field">
                  <label>Level:</label>
                  <input
                    type="number"
                    name="nivel"
                    value={formData.nivel}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    min="0"
                  />
                </div>
                <div className="px-fields">
                  <div className="px-field">
                    <label>PX Atual:</label>
                    <input
                      type="number"
                      name="pxAtual"
                      value={formData.pxAtual}
                      onChange={handleChange}
                      readOnly={isReadOnly}
                      required
                      min="0"
                    />
                  </div>
                  <div className="px-field">
                    <label>PX Total:</label>
                    <input
                      type="number"
                      name="pxTotal"
                      value={formData.pxTotal}
                      onChange={handleChange}
                      readOnly={isReadOnly}
                      required
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Dados do Personagem */}
            <div className="basic-fields-container">
              <div className="form-row">
                <div className="form-field">
                  <label>Nome do Personagem</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    placeholder="Digite o nome"
                  />
                </div>
                <div className="form-field">
                  <label>Nº de Identificação</label>
                  <input
                    type="text"
                    name="numeroIdentificacao"
                    value={formData.numeroIdentificacao}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    placeholder="Digite o número"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Idade</label>
                  <input
                    type="number"
                    name="idade"
                    value={formData.idade}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    min="1"
                    placeholder="Digite a idade"
                  />
                </div>
                <div className="form-field">
                  <label>Reino de Origem</label>
                  <select
                    name="reino"
                    value={formData.reino}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="" disabled>Selecionar Reino</option>
                    <option value="Indrún">Indrún</option>
                    <option value="Fadalór">Fadalór</option>
                    <option value="Largo Gélido">Largo Gélido</option>
                    <option value="Yutai Guarani">Yutai Guarani</option>
                    <option value="Trondór">Trondór</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Aptidão Mágica</label>
                  <input
                    type="text"
                    name="aptidao"
                    value={formData.aptidao}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    placeholder="Digite a aptidão"
                  />
                </div>
              </div>
            </div>

            {/* Estado Vital */}
            <div className="estado-vital-container">
              <h3 className="estado-vital-title">Estado Vital</h3>
              
              <div className="estado-vital-item">
                <label>Vigor:</label>
                <div className="quadrados-container">
                  {formData.vigor.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado vigor ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleEstadoVital('vigor', index)}
                    />
                  ))}
                </div>
              </div>

              <div className="estado-vital-item">
                <label>Essência:</label>
                <div className="quadrados-container">
                  {formData.essencia.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado essencia ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleEstadoVital('essencia', index)}
                    />
                  ))}
                </div>
              </div>

              <div className="estado-vital-item">
                <label className="label-with-tooltip">
                  Limite Supressão:
                  <span className="tooltip-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="tooltip-content">
                      <strong>Efeitos por Nível:</strong>
                      <ul>
                        <li><strong>Nível 1-2:</strong> Desvantagem em testes de Percepção.</li>
                        <li><strong>Nível 3-4:</strong> Dor física intensa (-1 em todos os testes).</li>
                        <li><strong>Nível 5:</strong> Sobrecarga (A magia falha e causa dano de Vigor).</li>
                      </ul>
                    </div>
                  </span>
                </label>
                <div className="quadrados-container">
                  {formData.limiteSupressao.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado limite-supressao ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleEstadoVital('limiteSupressao', index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Atributos */}
            <div className="ficha-section">
              <h3 className="section-header">Atributos</h3>
              <div className="atributos-container">
                <div className="atributo-item">
                  <label className="label-with-tooltip">
                    POTÊNCIA:
                    <span className="tooltip-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <div className="tooltip-content">
                        Físico/Resistência
                      </div>
                    </span>
                  </label>
                  <div className="quadrados-container">
                    {formData.potencia.map((preenchido: boolean, index: number) => (
                      <div
                        key={index}
                        className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                        onClick={() => toggleAtributo('potencia', index)}
                      />
                    ))}
                  </div>
                </div>

                <div className="atributo-item">
                  <label className="label-with-tooltip">
                    AGILIDADE:
                    <span className="tooltip-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <div className="tooltip-content">
                        Reflexos/Velocidade
                      </div>
                    </span>
                  </label>
                  <div className="quadrados-container">
                    {formData.agilidade.map((preenchido: boolean, index: number) => (
                      <div
                        key={index}
                        className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                        onClick={() => toggleAtributo('agilidade', index)}
                      />
                    ))}
                  </div>
                </div>

                <div className="atributo-item">
                  <label className="label-with-tooltip">
                    VONTADE:
                    <span className="tooltip-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <div className="tooltip-content">
                        Poder Mágico/Foco
                      </div>
                    </span>
                  </label>
                  <div className="quadrados-container">
                    {formData.vontade.map((preenchido: boolean, index: number) => (
                      <div
                        key={index}
                        className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                        onClick={() => toggleAtributo('vontade', index)}
                      />
                    ))}
                  </div>
                </div>

                <div className="atributo-item">
                  <label className="label-with-tooltip">
                    ENGENHO:
                    <span className="tooltip-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <div className="tooltip-content">
                        Intelecto/Percepção
                      </div>
                    </span>
                  </label>
                  <div className="quadrados-container">
                    {formData.engenho.map((preenchido: boolean, index: number) => (
                      <div
                        key={index}
                        className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                        onClick={() => toggleAtributo('engenho', index)}
                      />
                    ))}
                  </div>
                </div>

                <div className="atributo-item">
                  <label className="label-with-tooltip">
                    PRESENÇA:
                    <span className="tooltip-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                      </svg>
                      <div className="tooltip-content">
                        Lábia/Intimidação
                      </div>
                    </span>
                  </label>
                  <div className="quadrados-container">
                    {formData.presenca.map((preenchido: boolean, index: number) => (
                      <div
                        key={index}
                        className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                        onClick={() => toggleAtributo('presenca', index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Equipamento e Posses */}
            <div className="ficha-section equipamento-section">
              <h3 className="section-header">Equipamentos e Posses</h3>
              <div className="form-field equipamento-field">
                <textarea
                  name="equipamento"
                  value={formData.equipamento}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  placeholder="Liste os equipamentos e posses do personagem..."
                />
              </div>
            </div>

            {/* Manifestação Mágica */}
            <div className="ficha-section">
              <h3 className="section-header">Manifestação Mágica</h3>
              <div className="form-field">
                <textarea
                  name="manifestacaoMagica"
                  value={formData.manifestacaoMagica}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  placeholder="Descreva a manifestação mágica do personagem..."
                  rows={6}
                />
              </div>
            </div>

            {/* História */}
            <div className="ficha-section">
              <h3 className="section-header">História do Personagem</h3>
              <div className="form-field">
                <textarea
                  name="historia"
                  value={formData.historia}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  placeholder="Conte a história do seu personagem..."
                  rows={6}
                />
              </div>
            </div>

            {/* Botões de Ação - Mobile */}
            {mode === 'create' && (
              <div className="ficha-actions">
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Criar Personagem
                </button>
              </div>
            )}
            
            {mode === 'edit' && hasChanges && (
              <div className="ficha-actions">
                <button type="button" onClick={onClose} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Atualizar Personagem
                </button>
              </div>
            )}
          </form>
        ) : (
          // LAYOUT DESKTOP
          <form onSubmit={handleSubmit} className="ficha-form">
          {/* Imagem e Dados do Personagem */}
          <div className="top-section">
            <div className="image-container">
              <input
                type="file"
                id="personagem-image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isReadOnly}
                style={{ display: 'none' }}
              />
              <label htmlFor="personagem-image" className={`image-upload-box ${isReadOnly ? 'readonly' : ''}`}>
                {previewImage ? (
                  <img src={formatImageSrc(previewImage) || previewImage} alt="Personagem" className="preview-image" />
                ) : (
                  <div className="image-placeholder">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    <span>Selecionar Imagem</span>
                  </div>
                )}
              </label>
            </div>

            {/* Dados Básicos */}
            <div className="basic-fields-container">
              {/* Linha 1: Nome e Número de Identificação */}
              <div className="form-row">
                <div className="form-field">
                  <label>Nome do Personagem</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    placeholder="Digite o nome"
                  />
                </div>
                <div className="form-field">
                  <label>Nº de Identificação</label>
                  <input
                    type="text"
                    name="numeroIdentificacao"
                    value={formData.numeroIdentificacao}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    placeholder="Digite o número"
                  />
                </div>
              </div>

              {/* Linha 2: Idade, Reino e Aptidão */}
              <div className="form-row form-row-second">
                <div className="form-field idade-field">
                  <label>Idade</label>
                  <input
                    type="number"
                    name="idade"
                    value={formData.idade}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    min="1"
                    placeholder="Digite a idade"
                  />
                </div>
                <div className="form-field reino-field">
                  <label>Reino de Origem</label>
                  <select
                    name="reino"
                    value={formData.reino}
                    onChange={handleChange}
                    disabled={isReadOnly}
                    required
                  >
                    <option value="" disabled>Selecionar Reino</option>
                    <option value="Indrún">Indrún</option>
                    <option value="Fadalór">Fadalór</option>
                    <option value="Largo Gélido">Largo Gélido</option>
                    <option value="Yutai Guarani">Yutai Guarani</option>
                    <option value="Trondór">Trondór</option>
                  </select>
                </div>
                <div className="form-field aptidao-field">
                  <label>Aptidão Mágica</label>
                  <input
                    type="text"
                    name="aptidao"
                    value={formData.aptidao}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    placeholder="Digite a aptidão"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Level e Estado Vital */}
          <div className="level-estado-wrapper">
            <div className="level-px-container">
              <div className="level-field">
                <label>Level:</label>
                <input
                  type="number"
                  name="nivel"
                  value={formData.nivel}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  required
                  min="0"
                />
              </div>
              <div className="px-fields">
                <div className="px-field">
                  <label>PX Atual:</label>
                  <input
                    type="number"
                    name="pxAtual"
                    value={formData.pxAtual}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    min="0"
                  />
                </div>
                <div className="px-field">
                  <label>PX Total:</label>
                  <input
                    type="number"
                    name="pxTotal"
                    value={formData.pxTotal}
                    onChange={handleChange}
                    readOnly={isReadOnly}
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Estado Vital ao lado do Level */}
            <div className="estado-vital-container">
              <h3 className="estado-vital-title">Estado Vital</h3>
              
              <div className="estado-vital-item">
                <label>Vigor:</label>
                <div className="quadrados-container">
                  {formData.vigor.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado vigor ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleEstadoVital('vigor', index)}
                    />
                  ))}
                </div>
              </div>

              <div className="estado-vital-item">
                <label>Essência:</label>
                <div className="quadrados-container">
                  {formData.essencia.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado essencia ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleEstadoVital('essencia', index)}
                    />
                  ))}
                </div>
              </div>

              <div className="estado-vital-item">
                <label className="label-with-tooltip">
                  Limite Supressão:
                  <span className="tooltip-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="tooltip-content">
                      <strong>Efeitos por Nível:</strong>
                      <ul>
                        <li><strong>Nível 1-2:</strong> Desvantagem em testes de Percepção.</li>
                        <li><strong>Nível 3-4:</strong> Dor física intensa (-1 em todos os testes).</li>
                        <li><strong>Nível 5:</strong> Sobrecarga (A magia falha e causa dano de Vigor).</li>
                      </ul>
                    </div>
                  </span>
                </label>
                <div className="quadrados-container">
                  {formData.limiteSupressao.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado limite-supressao ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleEstadoVital('limiteSupressao', index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Atributos e Equipamento lado a lado */}
          <div className="atributos-equipamento-wrapper">
            {/* Atributos */}
            <div className="ficha-section">
              <h3 className="section-header">Atributos</h3>
              <div className="atributos-container">
              <div className="atributo-item">
                <label className="label-with-tooltip">
                  POTÊNCIA:
                  <span className="tooltip-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="tooltip-content">
                      Físico/Resistência
                    </div>
                  </span>
                </label>
                <div className="quadrados-container">
                  {formData.potencia.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleAtributo('potencia', index)}
                    />
                  ))}
                </div>
              </div>

              <div className="atributo-item">
                <label className="label-with-tooltip">
                  AGILIDADE:
                  <span className="tooltip-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="tooltip-content">
                      Reflexos/Velocidade
                    </div>
                  </span>
                </label>
                <div className="quadrados-container">
                  {formData.agilidade.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleAtributo('agilidade', index)}
                    />
                  ))}
                </div>
              </div>

              <div className="atributo-item">
                <label className="label-with-tooltip">
                  VONTADE:
                  <span className="tooltip-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="tooltip-content">
                      Poder Mágico/Foco
                    </div>
                  </span>
                </label>
                <div className="quadrados-container">
                  {formData.vontade.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleAtributo('vontade', index)}
                    />
                  ))}
                </div>
              </div>

              <div className="atributo-item">
                <label className="label-with-tooltip">
                  ENGENHO:
                  <span className="tooltip-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="tooltip-content">
                      Intelecto/Percepção
                    </div>
                  </span>
                </label>
                <div className="quadrados-container">
                  {formData.engenho.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleAtributo('engenho', index)}
                    />
                  ))}
                </div>
              </div>

              <div className="atributo-item">
                <label className="label-with-tooltip">
                  PRESENÇA:
                  <span className="tooltip-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div className="tooltip-content">
                      Lábia/Intimidação
                    </div>
                  </span>
                </label>
                <div className="quadrados-container">
                  {formData.presenca.map((preenchido: boolean, index: number) => (
                    <div
                      key={index}
                      className={`quadrado atributo ${preenchido ? 'preenchido' : ''} ${isReadOnly ? 'readonly' : ''}`}
                      onClick={() => toggleAtributo('presenca', index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

            {/* Equipamento e Posses */}
            <div className="ficha-section equipamento-section">
              <h3 className="section-header">Equipamentos e Posses</h3>
              <div className="form-field equipamento-field">
                <textarea
                  name="equipamento"
                  value={formData.equipamento}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                  placeholder="Liste os equipamentos e posses do personagem..."
                />
              </div>
            </div>
          </div>

          {/* Manifestação Mágica */}
          <div className="ficha-section">
            <h3 className="section-header">Manifestação Mágica</h3>
            <div className="form-field">
              <textarea
                name="manifestacaoMagica"
                value={formData.manifestacaoMagica}
                onChange={handleChange}
                readOnly={isReadOnly}
                placeholder="Descreva a manifestação mágica do personagem..."
                rows={6}
              />
            </div>
          </div>

          {/* História */}
          <div className="ficha-section">
            <h3 className="section-header">História do Personagem</h3>
            <div className="form-field">
              <textarea
                name="historia"
                value={formData.historia}
                onChange={handleChange}
                readOnly={isReadOnly}
                placeholder="Conte a história do seu personagem..."
                rows={6}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          {mode === 'create' && (
            <div className="ficha-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Criar Personagem
              </button>
            </div>
          )}
          
          {mode === 'edit' && hasChanges && (
            <div className="ficha-actions">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Atualizar Personagem
              </button>
            </div>
          )}
        </form>
        )}
      </div>
    </div>
    </>
  );
}
