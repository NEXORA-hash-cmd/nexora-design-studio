export type LanguageCode = 'en' | 'fr' | 'ar';

export interface Translations {
  appName: string;
  appSubtitle: string;
  saveProject: string;
  saving: string;
  savedLocally: string;
  unsavedChanges: string;
  newProject: string;
  openProjects: string;
  saveAs: string;
  deleteProject: string;
  export: string;
  chooseTheme: string;
  useThisTheme: string;
  themeSelected: string;
  activeTheme: string;
  overviewTab: string;
  canvasTab: string;
  financialsTab: string;
  marketTab: string;
  gtmTab: string;
  pitchTab: string;
  themeTab: string;
  exportCenterTab: string;
  exportPptx: string;
  exportPdf: string;
  exportPng: string;
  exportJpg: string;
  exportJson: string;
  exportCsv: string;
  exporting: string;
  exportSuccess: string;
  license: string;
  about: string;
  industry: string;
  stage: string;
  currency: string;
  unitEconomics: string;
  breakEven: string;
  forecast: string;
  totalAddressableMarket: string;
  competitors: string;
  customerPersona: string;
  milestones: string;
  ask: string;
  language: string;
  commercialLicense: string;
}

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  en: {
    appName: 'NEXORA',
    appSubtitle: 'Business Design Studio',
    saveProject: 'Save Project',
    saving: 'Saving...',
    savedLocally: 'Saved locally',
    unsavedChanges: 'Unsaved changes',
    newProject: 'New Business Venture',
    openProjects: 'Projects Dashboard',
    saveAs: 'Save As...',
    deleteProject: 'Delete Project',
    export: 'Export',
    chooseTheme: 'Choose Your Theme',
    useThisTheme: 'Use This Theme',
    themeSelected: 'Active Theme',
    activeTheme: 'Theme',
    overviewTab: 'Executive Dashboard',
    canvasTab: 'Business Model Canvas',
    financialsTab: 'Financials & Unit Economics',
    marketTab: 'Market & Competitors',
    gtmTab: 'Go-To-Market Engine',
    pitchTab: 'Pitch Deck & Summary',
    themeTab: 'Design & Themes',
    exportCenterTab: 'Export Center',
    exportPptx: 'Export PowerPoint (.pptx)',
    exportPdf: 'Export Business PDF (.pdf)',
    exportPng: 'Export Slide PNG (.png)',
    exportJpg: 'Export Slide JPG (.jpg)',
    exportJson: 'Export Backup (.json)',
    exportCsv: 'Export Financials (.csv)',
    exporting: 'Generating export file...',
    exportSuccess: 'Export generated successfully',
    license: 'Commercial License',
    about: 'About NEXORA',
    industry: 'Industry',
    stage: 'Stage',
    currency: 'Currency',
    unitEconomics: 'Unit Economics',
    breakEven: 'Break-Even Analysis',
    forecast: '12-Month Forecast',
    totalAddressableMarket: 'Total Addressable Market',
    competitors: 'Competitors',
    customerPersona: 'Target Customer Persona',
    milestones: 'GTM Milestones',
    ask: 'Capital Allocation & The Ask',
    language: 'Language',
    commercialLicense: 'Commercial Edition',
  },
  fr: {
    appName: 'NEXORA',
    appSubtitle: 'Studio de Conception Stratégique',
    saveProject: 'Enregistrer le projet',
    saving: 'Enregistrement...',
    savedLocally: 'Enregistré localement',
    unsavedChanges: 'Modifications non enregistrées',
    newProject: 'Nouveau Projet Commercial',
    openProjects: 'Tableau de bord des projets',
    saveAs: 'Enregistrer sous...',
    deleteProject: 'Supprimer le projet',
    export: 'Exporter',
    chooseTheme: 'Choisir votre Thème',
    useThisTheme: 'Utiliser ce thème',
    themeSelected: 'Thème Actif',
    activeTheme: 'Thème',
    overviewTab: 'Tableau de bord exécutif',
    canvasTab: 'Business Model Canvas',
    financialsTab: 'Finances & Économie Unitaire',
    marketTab: 'Marché & Concurrents',
    gtmTab: 'Moteur Go-To-Market',
    pitchTab: 'Pitch Deck & Résumé',
    themeTab: 'Design & Thèmes',
    exportCenterTab: 'Centre d’Exportation',
    exportPptx: 'Exporter PowerPoint (.pptx)',
    exportPdf: 'Exporter PDF Commercial (.pdf)',
    exportPng: 'Exporter Image PNG (.png)',
    exportJpg: 'Exporter Image JPG (.jpg)',
    exportJson: 'Exporter Sauvegarde (.json)',
    exportCsv: 'Exporter Finances (.csv)',
    exporting: 'Génération du fichier en cours...',
    exportSuccess: 'Fichier exporté avec succès',
    license: 'Licence Commerciale',
    about: 'À propos de NEXORA',
    industry: 'Secteur',
    stage: 'Stade',
    currency: 'Devise',
    unitEconomics: 'Économie Unitaire',
    breakEven: 'Seuil de Rentabilité',
    forecast: 'Prévisions sur 12 mois',
    totalAddressableMarket: 'Marché Total Adressable (TAM)',
    competitors: 'Concurrents',
    customerPersona: 'Profil Client Cible',
    milestones: 'Jalons Stratégiques',
    ask: 'Allocation du Capital & Demande',
    language: 'Langue',
    commercialLicense: 'Édition Commerciale',
  },
  ar: {
    appName: 'نيكسورا',
    appSubtitle: 'استوديو تصميم الأعمال الاستراتيجي',
    saveProject: 'حفظ المشروع',
    saving: 'جاري الحفظ...',
    savedLocally: 'محفوظ محلياً',
    unsavedChanges: 'تعديلات غير محفوظة',
    newProject: 'مشروع تجاري جديد',
    openProjects: 'لوحة تحكم المشاريع',
    saveAs: 'حفظ باسم...',
    deleteProject: 'حذف المشروع',
    export: 'تصدير',
    chooseTheme: 'اختر السمة والتصميم',
    useThisTheme: 'استخدم هذا القالب',
    themeSelected: 'السمة الحالية',
    activeTheme: 'السمة',
    overviewTab: 'لوحة القيادة التنفيذية',
    canvasTab: 'مخطط نموذج العمل التجاري',
    financialsTab: 'المالية واقتصاديات الوحدة',
    marketTab: 'السوق والمنافسون',
    gtmTab: 'محرك الدخول إلى السوق',
    pitchTab: 'العرض التقديمي والملخص',
    themeTab: 'التصميم والسمات',
    exportCenterTab: 'مركز التصدير',
    exportPptx: 'تصدير باوربوينت (.pptx)',
    exportPdf: 'تصدير ملف بي دي اف (.pdf)',
    exportPng: 'تصدير شريحة PNG (.png)',
    exportJpg: 'تصدير شريحة JPG (.jpg)',
    exportJson: 'تصدير نسخة احتياطية (.json)',
    exportCsv: 'تصدير البيانات المالية (.csv)',
    exporting: 'جاري توليد ملف التصدير...',
    exportSuccess: 'تم توليد وتنزيل الملف بنجاح',
    license: 'الترخيص التجاري',
    about: 'حول نظام نيكسورا',
    industry: 'القطاع',
    stage: 'المرحلة',
    currency: 'العملة',
    unitEconomics: 'اقتصاديات الوحدة',
    breakEven: 'نقطة التعادل',
    forecast: 'التوقعات المالية لـ 12 شهراً',
    totalAddressableMarket: 'إجمالي حجم السوق (TAM)',
    competitors: 'المنافسون',
    customerPersona: 'الملف النموذجي للعميل المستهدف',
    milestones: 'المحطات الرئيسية للإنطلاق',
    ask: 'تخصيص رأس المال والتمويل المطلوب',
    language: 'اللغة',
    commercialLicense: 'الإصدار التجاري المعتمد',
  },
};
