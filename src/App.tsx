import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  ArrowRight, 
  Check, 
  MapPin, 
  MessageCircle, 
  Instagram, 
  Play, 
  Sparkles, 
  Star, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  ShieldCheck, 
  Calendar, 
  HelpCircle, 
  Award, 
  Info,
  Clock,
  ThumbsUp
} from "lucide-react";

// ==========================================
// CONFIGURAÇÕES DE LINKS E IMAGENS DO EXPERT
// ==========================================

const EXPERT_INFO = {
  name: "Dra. Bruna Santos",
  profession: "Harmonização Facial",
  city: "Belo Horizonte",
  neighborhood: "Savassi",
  address: "Av. do Contorno, 6594 - Savassi, Belo Horizonte - MG",
  instagram: "https://www.instagram.com/dra.brunaasantos/reels/",
  whatsapp: "https://api.whatsapp.com/message/VXSULG4ZR44AL1?autoload=1&app_absent=0&utm_source=ig",
  videoUrl: "https://imgur.com/lnpRlCi", // Link do vídeo de procedimento
  videoEmbedUrl: "https://imgur.com/lnpRlCi/embed?pub=true" // Embed do imgur para o player
};

// Fotos da expert para autoridade e bastidores
const EXPERT_PHOTOS = {
  hero: "https://i.imgur.com/E1PsYRD.png", // Foto principal da expert (herói)
  authority: "https://i.imgur.com/lqkUXYv.png" // Outras fotos da expert
};

// Galeria de Antes e Depois (Resultados Reais)
// (Pronta para adicionar novos links facilmente!)
const BEFORE_AFTER_GALLERY = [
  "https://i.imgur.com/PQArSqo.png",
  "https://i.imgur.com/ZILE4Fs.png",
  "https://i.imgur.com/RDamTOP.png",
  "https://i.imgur.com/wPYim1j.png",
  "https://i.imgur.com/c429VKU.png",
  // Adicione novas imagens aqui simplesmente inserindo a URL como string:
  // "https://i.imgur.com/nova_foto.png",
];

// Seção de Fotos "de 💚" (Harmonização com afeto e conexões reais)
const HEART_GALLERY = [
  "https://i.imgur.com/hQP8hGY.png",
  "https://i.imgur.com/oRUBJRl.png",
  "https://i.imgur.com/CUXGKyO.png",
  "https://i.imgur.com/USdJGIl.png",
  // Espaço reservado para mais fotos de 5 a 14:
];

// Prints de Comentários / Avaliações de Pacientes
const COMMENT_SCREENSHOTS = [
  "https://i.imgur.com/q6XcDwx.png",
  "https://i.imgur.com/nP9Imp3.png",
  "https://i.imgur.com/vG6mGgl.png",
  // Espaço reservado para mais comentários de 4 a 13:
];

// Perguntas estruturadas do QUIZ de Alinhamento e Pré-Avaliação Estética
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Qual é o seu principal objetivo com a Harmonização Facial?",
    description: "Cada rosto possui uma arquitetura única. O que você gostaria de priorizar?",
    options: [
      { text: "Realçar meus traços de forma sutil e muito natural", key: "A" },
      { text: "Tratar sinais do tempo (flacidez, linhas finas ou perda de volume)", key: "B" },
      { text: "Projetar e desenhar áreas específicas (como lábios, mento ou mandíbula)", key: "C" },
      { text: "Entender de forma personalizada o que fica mais harmônico em meu rosto", key: "D" }
    ]
  },
  {
    id: 2,
    question: "O que mais te preocupa ou gera receio em fazer um procedimento?",
    description: "Sua segurança e paz de espírito são inegociáveis para mim.",
    options: [
      { text: "Tenho medo de ficar artificial, exagerada ou perder minha essência", key: "A" },
      { text: "Sentir dor ou ter um processo de recuperação difícil", key: "B" },
      { text: "Não saber exatamente de quais procedimentos eu realmente preciso", key: "C" },
      { text: "Não tenho receios, busco apenas uma profissional de alta confiança", key: "D" }
    ]
  },
  {
    id: 3,
    question: "Você já realizou algum tipo de procedimento injetável antes?",
    description: "Isso ajuda a entender a sensibilidade e o histórico da sua pele.",
    options: [
      { text: "Sim, e já estou acostumada com os cuidados", key: "A" },
      { text: "Sim, mas os resultados anteriores não me agradaram 100%", key: "B" },
      { text: "Não, seria a minha primeira experiência com injetáveis", key: "C" }
    ]
  },
  {
    id: 4,
    question: "O que você mais valoriza em uma consulta com sua especialista?",
    description: "Para mim, a beleza é um compromisso baseado na escuta atenta.",
    options: [
      { text: "Uma avaliação honesta que indique apenas o necessário, sem pressões", key: "A" },
      { text: "Técnicas de última geração e materiais de marcas premium mundiais", key: "B" },
      { text: "Acompanhamento pessoal próximo e suporte direto pós-procedimento", key: "C" }
    ]
  }
];

export default function App() {
  // Estados para controle do Quiz e Interatividade
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizState, setQuizState] = useState<"intro" | "questions" | "analyzing" | "result">("intro");
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [showQuizOverlay, setShowQuizOverlay] = useState(true);

  // Estados para o Lightbox da Galeria de Fotos
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxGallery, setLightboxGallery] = useState<string[]>([]);

  // Smooth scroll para seções do site principal
  const scrollToSection = (id: string) => {
    // Fecha qualquer visual que esteja impedindo se o usuário optou por continuar no site
    setShowQuizOverlay(false);
    
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Processo de simulação de carregamento luxuoso pós-quiz
  useEffect(() => {
    if (quizState === "analyzing") {
      setAnalyzingProgress(0);
      const interval = setInterval(() => {
        setAnalyzingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setQuizState("result");
            }, 600);
            return 100;
          }
          return prev + 4; // incrementa progressivamente
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [quizState]);

  // Função para lidar com a seleção de uma resposta do Quiz
  const handleAnswerSelect = (optionText: string) => {
    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    const updatedAnswers = { ...selectedAnswers, [currentQuestion.id]: optionText };
    setSelectedAnswers(updatedAnswers);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      // Avança suavemente para a próxima pergunta
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Vai para a análise premium
      setQuizState("analyzing");
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Constrói o texto personalizado para enviar ao WhatsApp da Dra. Bruna Santos
  const getWhatsAppMessageUrl = (includeQuizData: boolean) => {
    const baseText = "Olá Dra. Bruna Santos! ";
    if (!includeQuizData) {
      const cleanMessage = encodeURIComponent(baseText + "Achei seu site de Harmonização Facial e gostaria de agendar uma consulta de avaliação sem compromisso.");
      return `${EXPERT_INFO.whatsapp}&text=${cleanMessage}`;
    }

    // Formata as respostas de forma impecável e charmosa
    let quizDetails = "Gostaria de enviar meu diagnóstico prévio do Quiz:\n\n";
    QUIZ_QUESTIONS.forEach((q) => {
      const answer = selectedAnswers[q.id] || "Não respondido";
      quizDetails += `• *${q.question}*\nR: _${answer}_\n\n`;
    });
    quizDetails += "*Resultado:* Perfil Compatível para o Método de Harmonização Natural.\n\nGostaria de agendar minha avaliação personalizada em Belo Horizonte!";
    
    const formattedUrlMessage = encodeURIComponent(baseText + quizDetails);
    return `${EXPERT_INFO.whatsapp}&text=${formattedUrlMessage}`;
  };

  // Abre a imagem selecionada em Lightbox premium
  const openLightbox = (images: string[], index: number) => {
    setLightboxGallery(images);
    setLightboxIndex(index);
  };

  const handleNextLightbox = () => {
    if (lightboxIndex !== null && lightboxIndex < lightboxGallery.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    } else {
      setLightboxIndex(0); // volta ao começo
    }
  };

  const handlePrevLightbox = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    } else {
      setLightboxIndex(lightboxGallery.length - 1); // vai para o final
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1E1C19] font-sans overflow-x-hidden selection:bg-gold-200 selection:text-gold-900">
      
      {/* ========================================================
          1. QUIZ / PORTAL DE AVALIAÇÃO OVERLAY (SOBREPOSTO AO SITE)
          ======================================================== */}
      <AnimatePresence>
        {showQuizOverlay && (
          <motion.div 
            id="quiz-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/90 backdrop-blur-md overflow-y-auto"
          >
            {/* BACKGROUND SNEAK PEEK: Deixa o site principal visível suavemente nas bordas */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 opacity-95" />

            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-[#FAF9F6] text-[#1E1C19] rounded-3xl shadow-2xl overflow-hidden border border-gold-200/50 flex flex-col my-auto"
            >
              
              {/* ESTRUTURA HEADER DO QUIZ - Presente em todas as telas */}
              <div className="p-3 sm:p-4 border-b border-stone-200/60 bg-gradient-to-r from-stone-50 via-white to-stone-50 flex flex-col items-center justify-center relative">
                <div className="flex flex-col items-center text-center gap-1.5">
                  {/* Foto flutuante da Expert na moldura de ouro */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-gold-400 p-[2px] shadow-md shrink-0 mx-auto">
                    <img 
                      src={EXPERT_PHOTOS.hero} 
                      alt={EXPERT_INFO.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top rounded-full" 
                    />
                    <div className="absolute inset-0 rounded-full border border-gold-200/30" />
                  </div>
                  <div className="flex flex-col items-center">
                    <h3 className="font-serif font-bold text-sm sm:text-base tracking-tight text-stone-900 flex items-center justify-center gap-1.5">
                      {EXPERT_INFO.name}
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </h3>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gold-600 font-bold font-sans">
                      {EXPERT_INFO.profession}
                    </p>
                  </div>
                </div>
                
                {/* Botão sutil para fechar ou pular o quiz direto */}
                <button 
                  onClick={() => setShowQuizOverlay(false)}
                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
                  title="Pular avaliação e ver site"
                >
                  <X size={16} />
                </button>
              </div>

              {/* CONTEÚDO DINÂMICO DO QUIZ */}
              <div className="p-4 sm:p-5 flex-1 overflow-visible">
                
                {/* 1A. TELA INTRODUTÓRIA */}
                {quizState === "intro" && (
                  <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 py-1">
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gold-100 text-gold-800 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide uppercase">
                      <Sparkles size={11} className="text-gold-600" />
                      Avaliação de Harmonização Facial
                    </div>
                    
                    <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-bold tracking-tight leading-tight">
                      Será que o meu método é o ideal para o seu rosto?
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-sm">
                      Diferente de clínicas genéricas, meu atendimento é 100% individualizado. Responda a 4 perguntas simples para receber uma análise personalizada da sua beleza facial.
                    </p>

                    <div className="w-full pt-2 sm:pt-3 space-y-2">
                      <button
                        onClick={() => {
                          setQuizStarted(true);
                          setQuizState("questions");
                        }}
                        className="w-full py-2.5 sm:py-3 px-5 sm:px-6 rounded-2xl bg-gold-500 hover:bg-gold-600 text-white font-bold tracking-wide shadow-md transition duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer animate-btn-pulse"
                      >
                        Iniciar Avaliação Exclusiva
                        <ArrowRight size={16} />
                      </button>

                      <button
                        onClick={() => setShowQuizOverlay(false)}
                        className="w-full py-2 px-5 sm:py-2.5 sm:px-6 rounded-xl bg-transparent hover:bg-stone-100 text-stone-500 hover:text-stone-800 font-medium text-xs sm:text-sm transition duration-300 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Ir direto para o site principal
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-stone-400 font-mono mt-1 uppercase">
                      <ShieldCheck size={11} className="text-stone-400" />
                      Diagnóstico Privado e Seguro
                    </div>
                  </div>
                )}

                {/* 1B. PERGUNTAS ATIVAS */}
                {quizState === "questions" && (
                  <div className="space-y-3">
                    {/* Barra de progresso delicada */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-stone-500">
                        <span>Progresso da Avaliação</span>
                        <span className="font-bold text-gold-600">
                          {currentQuestionIndex + 1} de {QUIZ_QUESTIONS.length}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-stone-200/70 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gold-400 rounded-full transition-all duration-300" 
                          style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Pergunta e Descrição */}
                    <div className="space-y-1 py-0.5">
                      <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-gold-500">
                        Pergunta {QUIZ_QUESTIONS[currentQuestionIndex].id}
                      </span>
                      <h3 className="font-serif text-base sm:text-lg font-bold leading-snug text-stone-900">
                        {QUIZ_QUESTIONS[currentQuestionIndex].question}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-stone-500 leading-relaxed">
                        {QUIZ_QUESTIONS[currentQuestionIndex].description}
                      </p>
                    </div>

                    {/* Botões de Opções de Resposta */}
                    <div className="space-y-2 pt-0.5">
                      {QUIZ_QUESTIONS[currentQuestionIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelect(option.text)}
                          className="w-full text-left p-2.5 sm:p-3.5 rounded-xl border border-stone-200/80 bg-white hover:bg-gold-50/50 hover:border-gold-300 active:bg-gold-50 active:border-gold-400 transition-all duration-200 shadow-sm flex items-center gap-3 group cursor-pointer"
                        >
                          <span className="w-5 h-5 rounded bg-stone-100 text-stone-600 font-mono text-[10px] sm:text-xs font-bold flex items-center justify-center shrink-0 border border-stone-200 group-hover:bg-gold-200 group-hover:text-gold-950 transition-colors">
                            {option.key}
                          </span>
                          <span className="text-xs sm:text-sm text-stone-700 font-medium group-hover:text-stone-900 transition-colors">
                            {option.text}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Botão Voltar */}
                    {currentQuestionIndex > 0 && (
                      <button
                        onClick={handlePrevQuestion}
                        className="flex items-center gap-1 text-[11px] sm:text-xs text-stone-400 hover:text-stone-700 font-medium transition py-0.5 cursor-pointer"
                      >
                        <ChevronLeft size={12} />
                        Voltar para a pergunta anterior
                      </button>
                    )}
                  </div>
                )}

                {/* 1C. TELA DE ANÁLISE / CARREGAMENTO */}
                {quizState === "analyzing" && (
                  <div className="flex flex-col items-center text-center py-4 sm:py-6 space-y-4">
                    <div className="relative w-14 h-14 sm:w-16 h-16 flex items-center justify-center">
                      {/* Animação circular de loading */}
                      <div className="absolute inset-0 rounded-full border-4 border-gold-100 animate-pulse" />
                      <div className="absolute inset-0 rounded-full border-4 border-t-gold-500 animate-spin" />
                      <Sparkles size={20} className="text-gold-500 animate-bounce" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900">
                        Analisando suas respostas...
                      </h3>
                      <p className="text-[11px] sm:text-xs text-stone-500 max-w-xs">
                        Estamos cruzando seus objetivos de naturalidade com os padrões de simetria do método da Dra. Bruna Santos.
                      </p>
                    </div>

                    <div className="w-full max-w-xs space-y-1">
                      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200/50">
                        <div 
                          className="h-full bg-gradient-to-r from-gold-300 to-gold-500 rounded-full transition-all duration-100"
                          style={{ width: `${analyzingProgress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-stone-400 uppercase tracking-wider">
                        <span>Mapeamento Facial</span>
                        <span>{analyzingProgress}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 1D. RESULTADO PERSUASIVO DA AVALIAÇÃO */}
                {quizState === "result" && (
                  <div className="flex flex-col items-center text-center space-y-3 py-1">
                    
                    {/* Badge de Aprovação */}
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold tracking-wide uppercase border border-emerald-200/60">
                      <Check size={10} strokeWidth={3} />
                      Perfil Compatível • Paciente Ideal
                    </div>

                    {/* Foto da Expert Chest-Up compactada com moldura e fundo decorado premium */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-gold-500 p-0.5 shadow-md bg-white shrink-0 my-1 mx-auto flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 via-transparent to-gold-300/10 mix-blend-overlay" />
                      <img 
                        src={EXPERT_PHOTOS.authority} 
                        alt="Dra. Bruna Santos" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-top rounded-xl"
                      />
                    </div>

                    <h2 className="font-serif text-lg sm:text-xl text-stone-900 font-bold tracking-tight leading-snug">
                      Você é a Paciente Ideal!
                    </h2>

                    <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed max-w-xs">
                      Com base nas suas respostas, o Método da <strong className="text-gold-700">{EXPERT_INFO.name}</strong> consegue entregar exatamente a naturalidade e segurança que você procura. Seu perfil prioriza a elegância e foge de excessos artificiais.
                    </p>

                    {/* Compactado 100% para celular com 3 botões claros de ação imediata */}
                    <div className="w-full space-y-1.5 pt-1">
                      <a
                        href={getWhatsAppMessageUrl(true)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-3.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs tracking-wide shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-1.5 text-center cursor-pointer"
                      >
                        <MessageCircle size={14} />
                        1 • Enviar minha avaliação à Dra. Bruna
                      </a>

                      <a
                        href={getWhatsAppMessageUrl(false)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba56] text-white font-bold text-xs tracking-wide shadow-sm hover:scale-[1.01] active:scale-[0.99] transition duration-200 flex items-center justify-center gap-1.5 text-center cursor-pointer"
                      >
                        <MessageCircle size={14} />
                        2 • Chamar no WhatsApp sem compromisso
                      </a>

                      <button
                        onClick={() => setShowQuizOverlay(false)}
                        className="w-full py-1.5 px-3 rounded-lg bg-transparent border border-stone-200 text-stone-500 hover:bg-stone-50 hover:text-stone-800 font-medium text-[10px] sm:text-xs transition duration-200 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        3 • Não enviar e continuar para o site
                      </button>
                    </div>

                    <p className="text-[9px] text-stone-400 italic leading-snug">
                      Seus dados estão protegidos. Clicando no botão 1, você envia as respostas direto no nosso chat do WhatsApp de forma privada.
                    </p>
                  </div>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* ========================================================
          2. CABEÇALHO COM TICKER / LOGRADOURO DE FLUXO INFINITO
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md shadow-sm border-b border-stone-200/50">
        
        {/* LOGRADOURO SLIDER - Ticker passando devagar com direcionais clicáveis */}
        <div className="w-full bg-stone-950 text-white py-1.5 overflow-hidden relative">
          <div className="flex animate-marquee-slow whitespace-nowrap gap-8 text-xs font-mono uppercase tracking-widest items-center">
            {/* Duplicando o conteúdo para garantir o scroll infinito perfeito */}
            {[1, 2, 3].map((batch) => (
              <React.Fragment key={batch}>
                <button onClick={() => scrollToSection("sobre-mim")} className="hover:text-gold-300 transition shrink-0 flex items-center gap-1 bg-transparent cursor-pointer">
                  Sobre Dra. Bruna Santos • <span className="text-gold-400">Clique para ir</span>
                </button>
                <button onClick={() => scrollToSection("prova-visual")} className="hover:text-gold-300 transition shrink-0 flex items-center gap-1 bg-transparent cursor-pointer">
                  Resultados Reais • <span className="text-gold-400">Galeria</span>
                </button>
                <button onClick={() => scrollToSection("harmonizacao-coracao")} className="hover:text-gold-300 transition shrink-0 flex items-center gap-1 bg-transparent cursor-pointer">
                  Harmonização de 💚 • <span className="text-gold-400">Ver Fotos</span>
                </button>
                <button onClick={() => scrollToSection("onde-encontrar")} className="hover:text-gold-300 transition shrink-0 flex items-center gap-1 bg-transparent cursor-pointer">
                  Onde Encontrar • <span className="text-gold-400">Belo Horizonte</span>
                </button>
                <button onClick={() => scrollToSection("contato")} className="hover:text-gold-300 transition shrink-0 flex items-center gap-1 bg-transparent cursor-pointer">
                  Contato Direto • <span className="text-gold-400">WhatsApp</span>
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* BARRA DE MENU LIMPA E FOCADA EM MOBILE */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-lg tracking-wider text-stone-900">
              DRA. BRUNA SANTOS
            </span>
            <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase text-gold-600 bg-gold-100/50 px-2 py-0.5 rounded-full font-bold">
              Estética Facial
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowQuizOverlay(true)}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-gold-800 bg-gold-100 hover:bg-gold-200 transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles size={12} className="text-gold-600" />
              Fazer Avaliação
            </button>
            <a 
              href={EXPERT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-[#25D366] text-white hover:bg-[#20ba56] transition"
              title="Chamar no WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        {/* CATEGORIAS HORIZONTAIS DIRETAS (Para facilitar scroll instantâneo no toque) */}
        <div className="flex overflow-x-auto py-2 px-4 gap-2 bg-[#FAF9F6] border-t border-stone-200/40 no-scrollbar select-none">
          <button 
            onClick={() => scrollToSection("sobre-mim")}
            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-gold-50 hover:text-gold-800 text-stone-600 font-sans text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Sobre Mim
          </button>
          <button 
            onClick={() => scrollToSection("prova-visual")}
            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-gold-50 hover:text-gold-800 text-stone-600 font-sans text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Prova Visual
          </button>
          <button 
            onClick={() => scrollToSection("harmonizacao-coracao")}
            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-gold-50 hover:text-gold-800 text-stone-600 font-sans text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Harmonização de 💚
          </button>
          <button 
            onClick={() => scrollToSection("comentarios")}
            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-gold-50 hover:text-gold-800 text-stone-600 font-sans text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Comentários
          </button>
          <button 
            onClick={() => scrollToSection("onde-encontrar")}
            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-gold-50 hover:text-gold-800 text-stone-600 font-sans text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Onde nos Encontrar
          </button>
          <button 
            onClick={() => scrollToSection("contato")}
            className="px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-gold-50 hover:text-gold-800 text-stone-600 font-sans text-xs font-semibold shrink-0 transition-colors cursor-pointer"
          >
            Contato
          </button>
        </div>
      </header>


      {/* ========================================================
          3. SESSÃO HERO (PRIMEIRA DOBRA) - ESTILO PREMIUM E EXCLUSIVO
          ======================================================== */}
      <section className="relative pt-6 pb-12 sm:pb-20 bg-gradient-to-b from-[#FFFDF9] via-[#FAF9F6] to-stone-50 overflow-hidden">
        
        {/* Detalhes de luxo ao fundo */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gold-200/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* IMAGEM PRINCIPAL DA EXPERT (Grande e Majestosa) */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[340px] sm:max-w-[400px]">
              
              {/* Moldura elegante com efeito champagne-gold */}
              <div className="absolute inset-2 rounded-3xl border border-gold-400/30 -rotate-2 scale-102" />
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-gold-300/20 via-transparent to-gold-500/10 rounded-3xl blur-md -z-10" />

              <div className="relative bg-stone-100 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src={EXPERT_PHOTOS.hero} 
                  alt="Dra. Bruna Santos" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[480px]" 
                />
                
                {/* Overlay sutil para destacar a base */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />

                {/* Tag de Destaque Flutuante */}
                <div className="absolute bottom-4 left-4 bg-[#FAF9F6]/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-gold-200/50 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-800">
                    Belo Horizonte • Savassi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTEÚDO DA HERO SECTION (HEADLINE & CTA) */}
          <div className="lg:col-span-7 flex flex-col space-y-6 order-2 lg:order-1 text-center lg:text-left items-center lg:items-start max-w-xl mx-auto lg:mx-0">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-bold uppercase tracking-wide">
              <Star size={12} className="fill-gold-600 text-gold-600" />
              Especialista em Naturalidade Facial
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 leading-[1.1]">
              Eu sou a <span className="text-gold-600 block sm:inline">Dra. Bruna Santos</span>. Meu propósito é realçar a sua beleza única.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              Desenvolvi um método exclusivo de Harmonização Facial para mulheres que buscam elegância, rejuvenescimento e refinamento. Fujo completamente do visual artificial de consultórios tradicionais, focando 100% em restaurar a sua segurança natural.
            </p>

            {/* BOTÃO CTA DA HERO COM MICROTEXTO */}
            <div className="w-full sm:w-auto pt-2">
              <a
                href={EXPERT_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gold-500 hover:bg-gold-600 text-white font-extrabold tracking-wide text-sm sm:text-base shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-btn-pulse"
              >
                <MessageCircle size={20} className="fill-white/10" />
                Agendar consulta no whatsapp
              </a>
            </div>

            {/* Micro selos de credibilidade */}
            <div className="grid grid-cols-3 gap-4 w-full pt-4 border-t border-stone-200/60 font-sans">
              <div className="text-center lg:text-left">
                <span className="block font-serif font-bold text-stone-900 text-lg sm:text-xl">100%</span>
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">Natural</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-serif font-bold text-stone-900 text-lg sm:text-xl">Premium</span>
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">Marcas Mundiais</span>
              </div>
              <div className="text-center lg:text-left">
                <span className="block font-serif font-bold text-stone-900 text-lg sm:text-xl">Exclusivo</span>
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">Individualizado</span>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          VÍDEO DE APRESENTAÇÃO DE PROCEDIMENTO (DESTAQUE NO INÍCIO)
          ======================================================== */}
      <section className="bg-stone-900 text-white py-12 sm:py-16 relative overflow-hidden">
        {/* Elemento de iluminação gold */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Lado Esquerdo: Player de Vídeo ou GIF Animado em Iframe para Imgur */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-gold-400/50 bg-stone-950 aspect-video w-full max-w-2xl mx-auto">
              
              {/* Native premium video player with direct MP4 link for flawless cross-browser execution */}
              <video 
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="auto"
                referrerPolicy="no-referrer"
              >
                <source src="https://i.imgur.com/lnpRlCi.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>

              <div className="absolute bottom-3 right-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gold-300/30 flex items-center gap-1 pointer-events-none">
                <Play size={10} className="fill-gold-400 text-gold-400" />
                <span className="text-[9px] font-mono tracking-widest uppercase text-gold-100">
                  Aperte o Play
                </span>
              </div>
            </div>
          </div>

          {/* Lado Direito: Cópia Persuasiva do Vídeo */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 text-center lg:text-left max-w-md mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 text-gold-300 rounded-full text-[10px] font-mono uppercase tracking-widest w-fit mx-auto lg:mx-0 border border-stone-700">
              <Sparkles size={11} className="text-gold-400" />
              Método Bruna Santos em Ação
            </div>
            
            <h2 className="font-serif text-xl sm:text-2xl font-bold leading-snug tracking-tight text-gold-100">
              Sinta a Diferença de um Cuidado Exclusivo
            </h2>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Descubra como a beleza pode ser realçada com técnica, sensibilidade e propósito. Resultados naturais e transformadores. Aperte o play e sinta a diferença de ser cuidada por quem entende que sua beleza é única, e merece atenção especial.
            </p>

            <div className="pt-2">
              <a
                href={EXPERT_INFO.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-bold uppercase tracking-widest group transition-all"
              >
                Agende sua avaliação agora
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          4. BLOCO "QUEM SOU EU" (AUTORIDADE PESSOAL E HISTÓRIA)
          ======================================================== */}
      <section id="sobre-mim" className="py-16 sm:py-24 bg-[#FAF9F6] relative">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* FOTO DA EXPERT PARA AUTORIDADE (BASTIDORES) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px]">
              
              <div className="absolute inset-4 rounded-3xl border-2 border-gold-500/20 rotate-3 scale-102 -z-10" />

              <div className="relative rounded-3xl overflow-hidden shadow-xl border-8 border-white bg-white">
                <img 
                  src={EXPERT_PHOTOS.authority} 
                  alt="Dra. Bruna Santos em atendimento" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover max-h-[460px]" 
                />
                
                {/* Selo elegante flutuante de autoridade */}
                <div className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl shadow-md border border-stone-700/50 text-center">
                  <Award size={18} className="text-gold-400 mx-auto mb-1" />
                  <span className="block text-[8px] font-mono tracking-widest text-stone-400 uppercase">Foco Em</span>
                  <span className="block text-xs font-bold text-white font-sans">Simetria Real</span>
                </div>
              </div>
            </div>
          </div>

          {/* TEXTO CURTO E HUMANO EM PRIMEIRA PESSOA */}
          <div className="lg:col-span-7 space-y-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-semibold tracking-wide uppercase">
              Autoridade Pessoal
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
              Minha missão é revelar a elegância escondida em cada detalhe do seu rosto.
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              <p>
                Diferente das clínicas corporativas que empurram pacotes padronizados e "rostos congelados", eu fundei meu próprio consultório focado em um único lema: <strong>a naturalidade como mantra absoluto</strong>.
              </p>
              <p>
                Acredito que uma harmonização de excelência não muda quem você é, mas realça e devolve os contornos e volumes que o tempo esmaeceu. É um processo guiado por sensibilidade, respeito anatômico e muito estudo técnico.
              </p>
            </div>

            {/* Diferenciais em Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-100/50 border border-stone-200/40">
                <div className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Avaliação Inteiramente Individual</h4>
                  <p className="text-[11px] text-stone-500 leading-normal">Mapeio suas proporções faciais em repouso e movimento.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-100/50 border border-stone-200/40">
                <div className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Segurança & Conforto Térmico</h4>
                  <p className="text-[11px] text-stone-500 leading-normal">Uso de anestésicos de ponta e técnicas de aplicação indolores.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-100/50 border border-stone-200/40">
                <div className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Zero Exageros Clínicos</h4>
                  <p className="text-[11px] text-stone-500 leading-normal">Recuso procedimentos desnecessários que possam deformar seus traços.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-stone-100/50 border border-stone-200/40">
                <div className="w-5 h-5 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Suporte Direto via WhatsApp</h4>
                  <p className="text-[11px] text-stone-500 leading-normal">Você tem contato direto comigo para tirar dúvidas no pós-sessão.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => scrollToSection("contato")}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Conhecer minha agenda de Belo Horizonte
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          5. BLOCO "RESULTADOS REAIS" (PROVA VISUAL FORTE) - GALERIA EM GRID
          ======================================================== */}
      <section id="prova-visual" className="py-16 bg-stone-50 border-t border-b border-stone-200/50 relative">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header da Seção */}
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-bold uppercase tracking-wide">
              Resultados de Pacientes
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
              Beleza que se Revela, sem Deformar.
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Veja o impacto real e sutil das transformações. Toque em qualquer imagem para abrir a foto em alta resolução e conferir a perfeição nos detalhes.
            </p>
          </div>

          {/* Carrossel Infinito de Imagens de Antes e Depois (Auto-scrolling) */}
          <div className="relative w-full overflow-hidden py-4 select-none">
            {/* Sombras de fade nas laterais para sensação ultra-premium */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-5 w-max animate-marquee-slow hover:[animation-play-state:paused]">
              {/* Duplicamos a galeria para loop contínuo e sem emendas */}
              {[...BEFORE_AFTER_GALLERY, ...BEFORE_AFTER_GALLERY].map((img, index) => {
                const originalIndex = index % BEFORE_AFTER_GALLERY.length;
                return (
                  <div 
                    key={index}
                    onClick={() => openLightbox(BEFORE_AFTER_GALLERY, originalIndex)}
                    className="group relative w-[180px] sm:w-[240px] aspect-[3/4] bg-stone-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-stone-200 cursor-zoom-in shrink-0"
                  >
                    <div className="absolute inset-0 transition duration-500 group-hover:scale-105 bg-stone-950">
                      <img 
                        src={img} 
                        alt="" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover blur-md opacity-35 scale-110" 
                      />
                    </div>
                    <img 
                      src={img} 
                      alt={`Caso de Harmonização ${originalIndex + 1}`} 
                      referrerPolicy="no-referrer"
                      className="relative z-10 w-full h-full object-contain p-2 transition duration-500 group-hover:scale-[1.02]" 
                    />
                    
                    {/* Overlay Hover decorativo */}
                    <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/30 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <Sparkles size={16} className="text-gold-600" />
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2 right-2 bg-stone-950/70 backdrop-blur-md py-1 px-2 rounded-lg border border-stone-700/50 text-center pointer-events-none">
                      <span className="text-[9px] font-mono tracking-widest text-gold-200 uppercase font-bold">
                        Caso #{originalIndex + 1}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aviso discreto obrigatório */}
          <div className="mt-6 text-center">
            <p className="text-[10px] sm:text-xs text-stone-400 font-sans italic max-w-md mx-auto">
              * Resultados podem variar de pessoa para pessoa de acordo com a resposta fisiológica individual. Fotos autorizadas formalmente por nossas queridas pacientes.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================================
          6. NOVO BLOCO: "HARMONIZAÇÃO DE 💚" (DEPOIMENTOS DE CORAÇÃO)
          ======================================================== */}
      <section id="harmonizacao-coracao" className="py-16 bg-[#FAF9F6] relative overflow-hidden">
        {/* Adorno visual */}
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase tracking-wide border border-emerald-200">
              <Heart size={12} className="fill-emerald-500 text-emerald-500 animate-pulse" />
              Harmonização de Coração
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
              O Sentimento que Transborda em cada Feedback 💚
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Momentos de pura felicidade e gratidão partilhados voluntariamente pelas nossas queridas pacientes. 
            </p>
          </div>

          {/* Galeria Horizontal Autocomportada de Coração (Marquee reverso auto-scrolling) */}
          <div className="relative w-full overflow-hidden py-4 select-none">
            {/* Sombras de fade nas laterais para sensação ultra-premium */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#FAF9F6] to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-5 w-max animate-marquee-slow-reverse hover:[animation-play-state:paused]">
              {[...HEART_GALLERY, ...HEART_GALLERY].map((img, index) => {
                const originalIndex = index % HEART_GALLERY.length;
                return (
                  <div 
                    key={index}
                    onClick={() => openLightbox(HEART_GALLERY, originalIndex)}
                    className="shrink-0 w-[220px] sm:w-[260px] aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-md border border-stone-200/60 p-2 hover:shadow-lg transition-shadow duration-300 cursor-zoom-in"
                  >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-stone-950">
                        <img 
                          src={img} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover blur-md opacity-35 scale-110" 
                        />
                      </div>
                      <img 
                        src={img} 
                        alt={`Feedback Harmonização de Coração ${originalIndex + 1}`} 
                        referrerPolicy="no-referrer"
                        className="relative z-10 w-full h-full object-contain p-2" 
                      />
                      <div className="absolute inset-0 bg-stone-950/10 z-10 pointer-events-none" />
                      
                      {/* Coração sutil no canto */}
                      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-full shadow-md">
                        <Heart size={14} className="fill-emerald-500 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-4">
            <span className="text-[11px] text-stone-400 font-sans">
              ✨ Toque em qualquer imagem para ampliar e ler os depoimentos em alta resolução ✨
            </span>
          </div>

        </div>
      </section>


      {/* ========================================================
          7. ÁREA DE COMENTÁRIOS DE PACIENTES (WHATSAPP SCREENSHOTS)
          ======================================================== */}
      <section id="comentarios" className="py-16 bg-stone-50 border-t border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gold-100 text-gold-800 rounded-full text-xs font-bold uppercase tracking-wide">
              Comentarios
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              O que dizem no dia seguinte?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Veja prints reais de conversas espontâneas das nossas pacientes expressando a alegria com a recuperação e o visual harmônico.
            </p>
          </div>

          {/* Carrossel Autocomportado de Conversas no WhatsApp (Auto-scrolling) */}
          <div className="relative w-full overflow-hidden py-4 select-none">
            {/* Sombras de fade nas laterais para sensação ultra-premium */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />
            
            <div className="flex gap-6 w-max animate-marquee-medium hover:[animation-play-state:paused]">
              {[...COMMENT_SCREENSHOTS, ...COMMENT_SCREENSHOTS, ...COMMENT_SCREENSHOTS].map((img, index) => {
                const originalIndex = index % COMMENT_SCREENSHOTS.length;
                return (
                  <div 
                    key={index}
                    onClick={() => openLightbox(COMMENT_SCREENSHOTS, originalIndex)}
                    className="shrink-0 w-[200px] sm:w-[240px] relative bg-white rounded-2xl p-2 shadow-sm border border-stone-200/80 hover:shadow-md transition duration-300 cursor-zoom-in"
                  >
                    <div className="relative rounded-xl overflow-hidden aspect-[9/16] bg-stone-100 flex items-center justify-center">
                      <div className="absolute inset-0 bg-stone-950">
                        <img 
                          src={img} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover blur-md opacity-35 scale-110" 
                        />
                      </div>
                      <img 
                        src={img} 
                        alt={`Depoimento de Paciente no WhatsApp ${originalIndex + 1}`} 
                        referrerPolicy="no-referrer"
                        className="relative z-10 w-full h-full object-contain p-1" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent z-10 pointer-events-none" />
                    </div>
                    
                    {/* Elemento de decoração para parecer celular premium */}
                    <div className="pt-2 flex items-center justify-between px-2">
                      <span className="text-[10px] font-mono text-stone-400 font-bold uppercase flex items-center gap-1">
                        <Check size={12} className="text-emerald-500" /> Conversa Autorizada
                      </span>
                      <ThumbsUp size={11} className="text-gold-500" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>


      {/* ========================================================
          8. BLOCO "POR QUE CONFIAR EM MIM" (VALORES & DIFERENCIAIS)
          ======================================================== */}
      <section className="py-16 sm:py-24 bg-[#FAF9F6] relative">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-mono tracking-widest uppercase text-gold-600 font-extrabold bg-gold-100/55 px-3 py-1 rounded-full">
              Padrão de Excelência
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
              Por que escolher o meu método de atendimento?
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              O cuidado com a face exige responsabilidade máxima. Veja os pilares de exclusividade que estruturam o meu trabalho em Belo Horizonte.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Avaliação Honesta</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Eu só indico procedimentos que realmente valorizarão sua expressão. Se eu julgar que você não precisa ou que pode ficar artificial, direi honestamente e recusarei realizar.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-4">
                <Award size={20} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Materiais de Linha Premium</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Utilizo apenas produtos aprovados pelas agências reguladoras e provenientes das principais marcas líderes mundiais em ácido hialurônico e bioestimuladores de colágeno.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-4">
                <Clock size={20} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Consulta Sem Pressa</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Nossos horários são agendados com ampla janela de tempo. Você tem total liberdade de conversar, tirar suas dúvidas e tomar sua decisão com absoluta tranquilidade.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-4">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Acompanhamento Pós-Sessão</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Sua segurança pós-procedimento é monitorada pessoalmente por mim. Disponibilizo um canal direto para sanar qualquer dúvida durante os dias de recuperação.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Naturalidade Como Mantra</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                O maior elogio que recebo é quando as pacientes me contam que as amigas elogiaram o viço e a beleza do rosto, sem jamais desconfiar de que fizeram algum tratamento.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/60 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600 mb-4">
                <MapPin size={20} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-lg mb-2">Consultório de Alta Gastronomia Visual</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Um espaço intimista e extremamente acolhedor na melhor região de Belo Horizonte, pensado para garantir sigilo, privacidade e extremo conforto.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ========================================================
          9. CTA INTERMEDIÁRIO (REDUÇÃO DE OBJEÇÕES & SEGURANÇA)
          ======================================================== */}
      <section className="bg-stone-900 text-white py-12 sm:py-16 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-radial-gradient from-stone-800 to-stone-950 opacity-90" />
        
        <div className="relative max-w-xl mx-auto px-4 space-y-6">
          <div className="w-12 h-12 rounded-full bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400">
            <Sparkles size={22} className="animate-spin-slow" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-gold-100">
            Ainda com receio de ficar artificial?
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Eu compreendo. A internet está repleta de exageros estéticos. Por isso, convido você a realizar uma pré-avaliação diagnóstica sem custos para alinhar expectativas e desenhar um plano de rejuvenescimento verdadeiramente elegante e elegante.
          </p>

          <div className="pt-2">
            <a
              href={EXPERT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 py-3.5 px-8 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-lg cursor-pointer"
            >
              <MessageCircle size={16} />
              Falar Comigo no WhatsApp
            </a>
          </div>

          <p className="text-[10px] text-stone-500 font-mono uppercase tracking-widest">
            ✦ Resposta humanizada por nossa equipe em minutos
          </p>
        </div>
      </section>


      {/* ========================================================
          10. COMO FUNCIONA A PRIMEIRA CONSULTA (PASSO A PASSO SIMPLE)
          ======================================================= */}
      <section className="py-16 sm:py-24 bg-stone-50 border-t border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4">
          
          <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
            <span className="text-[11px] font-mono tracking-widest uppercase text-stone-500 font-extrabold">
              Jornada Simplificada
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Sua beleza em 3 passos simples
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Desenvolvemos um fluxo de atendimento exclusivo focado no seu conforto, clareza e total segurança psicológica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto font-sans">
            
            {/* Passo 1 */}
            <div className="relative flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-2xl border border-stone-200/50 shadow-sm">
              <span className="absolute -top-4 w-8 h-8 rounded-full bg-gold-500 text-white font-mono text-sm font-bold flex items-center justify-center border-2 border-white shadow-md">
                1
              </span>
              <div className="pt-2 text-gold-600">
                <MessageCircle size={24} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Contato Prévio</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Você entra em contato clicando nos botões deste site e escolhe a melhor data com minha equipe dedicada pelo WhatsApp.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="relative flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-2xl border border-stone-200/50 shadow-sm">
              <span className="absolute -top-4 w-8 h-8 rounded-full bg-gold-500 text-white font-mono text-sm font-bold flex items-center justify-center border-2 border-white shadow-md">
                2
              </span>
              <div className="pt-2 text-gold-600">
                <Calendar size={24} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Avaliação e Planejamento</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                No consultório, fazemos um diagnóstico detalhado em Belo Horizonte, fotografando, medindo e entendendo seus anseios estéticos.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="relative flex flex-col items-center text-center space-y-3 p-6 bg-white rounded-2xl border border-stone-200/50 shadow-sm">
              <span className="absolute -top-4 w-8 h-8 rounded-full bg-gold-500 text-white font-mono text-sm font-bold flex items-center justify-center border-2 border-white shadow-md">
                3
              </span>
              <div className="pt-2 text-gold-600">
                <Check size={24} />
              </div>
              <h3 className="font-serif font-bold text-stone-900 text-base">Procedimento Elegante</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Aplicamos técnicas de conforto e realizamos o procedimento com precisão microscópica. Você sai pronta, segura e confiante.
              </p>
            </div>

          </div>

          <div className="text-center mt-8 max-w-sm mx-auto">
            <span className="text-[10px] sm:text-xs text-stone-400 font-sans italic leading-normal">
              * Sem qualquer tipo de pressões ou obrigatoriedades. Você decide se quer realizar a aplicação com total autonomia.
            </span>
          </div>

        </div>
      </section>


      {/* ========================================================
          11. ONDE NOS ENCONTRAR (ENDEREÇO EM BELO HORIZONTE COM MAPA)
          ======================================================== */}
      <section id="onde-encontrar" className="py-16 sm:py-24 bg-[#FAF9F6] relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Lado Esquerdo: Detalhes do Endereço */}
            <div className="lg:col-span-5 space-y-6 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-semibold tracking-wide uppercase">
                <MapPin size={12} className="text-gold-600 animate-bounce" />
                Localização Exclusiva
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-stone-900">
                Onde a exclusividade e a privacidade se encontram.
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Nosso espaço foi estrategicamente planejado no bairro <strong>Savassi</strong>, uma das regiões mais sofisticadas e de fácil acesso de Belo Horizonte. Oferecemos estrutura com segurança, estacionamento e total privacidade para o seu atendimento.
              </p>

              <div className="pt-2 space-y-4 text-left border-t border-stone-200/60">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center shrink-0 text-gold-600">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="block font-sans text-xs font-bold text-stone-900">Endereço</span>
                    <span className="block font-sans text-xs text-stone-600 leading-relaxed">
                      {EXPERT_INFO.address}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg bg-gold-50 flex items-center justify-center shrink-0 text-gold-600">
                    <Clock size={16} />
                  </div>
                  <div>
                    <span className="block font-sans text-xs font-bold text-stone-900">Horários</span>
                    <span className="block font-sans text-xs text-stone-600">
                      Segunda a Sexta: 09h às 19h (Apenas com horário agendado)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(EXPERT_INFO.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-800 hover:bg-stone-50 text-stone-800 font-bold text-xs uppercase tracking-wider transition"
                >
                  Abrir no Google Maps
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Lado Direito: Iframe do Mapa do Endereço */}
            <div className="lg:col-span-7 w-full">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white aspect-[4/3] w-full max-w-xl mx-auto">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3750.771143890351!2d-43.9381884!3d-19.9381534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDU2JzE3LjMiUyA0M8KwNTYnMTcuNSJX!5e0!3m2!1spt-BR!2sbr!4v1655000000000!5m2!1spt-BR!2sbr"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização do Consultório"
                />
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================
          12. CTA FINAL (DECISÃO ABSOLUTA)
          ======================================================== */}
      <section id="contato" className="py-16 sm:py-24 bg-stone-900 text-white relative overflow-hidden">
        
        {/* Adorno dourado de luxo ao fundo */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 text-center space-y-8">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-800 text-gold-300 rounded-full text-xs font-bold uppercase tracking-wider border border-stone-700">
            <Sparkles size={12} className="text-gold-400" />
            Vagas Limitadas para este Mês
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-gold-100">
            Pronta para dar o passo em direção à sua melhor versão?
          </h2>

          <p className="text-xs sm:text-base text-stone-300 leading-relaxed max-w-xl mx-auto font-sans">
            Recupere o viço, harmonize os ângulos e desfrute de um contorno sutil. Agende sua primeira consulta em Belo Horizonte agora de forma rápida e totalmente sem compromisso.
          </p>

          <div className="w-full sm:w-auto pt-2 space-y-3 flex flex-col items-center">
            <a
              href={EXPERT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 py-4 px-10 rounded-2xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-extrabold tracking-wide text-sm sm:text-base shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] animate-btn-pulse"
            >
              <MessageCircle size={20} className="fill-stone-950/10 text-stone-950" />
              Clique aqui para falar comigo no whatsapp
            </a>
            <p className="text-xs text-stone-400 font-sans italic">
              ✦ Primeira consulta para alinhamento sem obrigações.
            </p>
          </div>

        </div>
      </section>


      {/* ========================================================
          13. RODAPÉ SIMPLES COM ASSINATURA MANUAL DE PRESTÍGIO
          ======================================================== */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800/60 font-sans">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Assinatura Manual */}
          <div className="space-y-1">
            <span className="block font-signature italic font-light text-gold-300 text-4xl sm:text-5xl tracking-wide select-none">
              Bruna Santos
            </span>
            <p className="text-xs text-stone-400 font-mono uppercase tracking-widest font-bold">
              {EXPERT_INFO.profession} • Belo Horizonte
            </p>
          </div>

          <div className="text-xs space-y-2">
            <p className="text-stone-300">
              © {new Date().getFullYear()} {EXPERT_INFO.name}. Todos os direitos reservados.
            </p>
            <p className="text-stone-500 max-w-xs leading-normal">
              Desenvolvimento premium voltado à privacidade de dados de acordo com as normas estéticas vigentes.
            </p>
          </div>

          <div className="flex gap-4">
            <a 
              href={EXPERT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-stone-900 text-stone-300 hover:bg-gold-500 hover:text-stone-950 transition-all shadow-md"
              title="Acessar Reels no Instagram"
            >
              <Instagram size={18} />
            </a>
            <a 
              href={EXPERT_INFO.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-stone-900 text-stone-300 hover:bg-[#25D366] hover:text-white transition-all shadow-md"
              title="Acessar WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          </div>

        </div>
      </footer>


      {/* ========================================================
          14. COMPONENTE PORTÁTIL DE LIGHTBOX DE IMAGENS
          ======================================================== */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-sm flex flex-col justify-between p-4"
          >
            {/* Header do Lightbox */}
            <div className="flex justify-between items-center text-white py-2">
              <span className="text-xs font-mono tracking-widest uppercase text-gold-300">
                Visualização de Caso: {lightboxIndex + 1} de {lightboxGallery.length}
              </span>
              <button 
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-full bg-stone-900 hover:bg-stone-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Imagem Centralizada com Navegação Lateral */}
            <div className="flex-1 flex items-center justify-between gap-4 relative">
              <button 
                onClick={handlePrevLightbox}
                className="p-2 rounded-full bg-stone-900/50 hover:bg-stone-800 text-white shrink-0 absolute left-2 z-10"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="w-full max-w-2xl mx-auto aspect-auto flex justify-center items-center overflow-hidden rounded-2xl border border-stone-800">
                <img 
                  src={lightboxGallery[lightboxIndex]} 
                  alt={`Caso ampliado ${lightboxIndex + 1}`} 
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] object-contain rounded-xl"
                />
              </div>

              <button 
                onClick={handleNextLightbox}
                className="p-2 rounded-full bg-stone-900/50 hover:bg-stone-800 text-white shrink-0 absolute right-2 z-10"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Footer do Lightbox */}
            <div className="text-center text-xs text-stone-400 py-3 font-sans">
              <p>Naturalidade e elegância nos contornos faciais por {EXPERT_INFO.name}.</p>
              <button 
                onClick={() => {
                  setLightboxIndex(null);
                  scrollToSection("contato");
                }}
                className="mt-2 inline-flex items-center gap-1 text-gold-400 hover:text-gold-300 font-bold uppercase tracking-widest"
              >
                Quero um resultado parecido 💚
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
