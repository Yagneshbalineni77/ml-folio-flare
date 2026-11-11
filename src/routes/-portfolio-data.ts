// Content for the portfolio route (src/routes/index.tsx).
// The leading "-" keeps TanStack Router from treating this file as a route.
// Every fact here mirrors YAGNESH_RESUME.pdf — update both together.

export const profile = {
  name: "Yagnesh Balineni",
  firstName: "Yagnesh",
  lastName: "Balineni",
  role: "Machine Learning & AI Engineer",
  school: "VIT Chennai",
  location: "Chennai, India",
  email: "yagneshbalineni007@gmail.com",
  github: "https://github.com/Yagneshbalineni77",
  githubHandle: "Yagneshbalineni77",
  linkedin: "https://www.linkedin.com/in/yagnesh-balineni-890167287",
  resume: "/Yagnesh_Balineni_Resume.pdf",
  avatar: "/yagnesh-avatar.webp",
  intro:
    "I build computer-vision, generative-AI and energy-efficient deep-learning systems — from production pipelines that run every day to peer-reviewed research. B.Tech in Electronics & Computer Engineering at VIT Chennai.",
  bio: "I’m a machine learning and AI engineer studying Electronics and Computer Engineering at VIT Chennai. I build deep-learning systems that ship — an autonomous AI video pipeline that publishes every day, a brain-tumour MRI classifier at 92.44% test accuracy — and I research energy-efficient spiking neural networks for my final-year thesis.",
};

export const heroStats = [
  { value: "92.44%", label: "MRI tumour test accuracy" },
  { value: "16.2×", label: "SNN inference energy cut" },
  { value: "2", label: "Best-system awards · GHC ’26" },
];

// Artwork generated for this portfolio (public/art). Every tile illustrates a
// real project, role or research area from the résumé.
const art = (name: string) => `/art/${name}.webp`;

export const showcaseRows = [
  [
    { src: art("m-yolo"), label: "Real-time detection · YOLO" },
    { src: art("mri-feature"), label: "Brain-tumour MRI" },
    { src: art("video-feature"), label: "AI video pipeline" },
    { src: art("m-hyperloop"), label: "Dromos Hyperloop" },
    { src: art("snn-feature"), label: "Spiking neural networks" },
    { src: art("m-featuremaps"), label: "CNN feature maps" },
    { src: art("shadow-feature"), label: "Deep-shadow volumetry" },
    { src: art("m-gpu-cluster"), label: "Multi-GPU A100 training" },
  ],
  [
    { src: art("m-bms"), label: "Battery management system" },
    { src: art("mri-slices"), label: "MRI attention maps" },
    { src: art("m-transformer"), label: "LLM pipelines" },
    { src: art("shadow-voxels"), label: "3D voxel reconstruction" },
    { src: art("m-latent"), label: "Representation learning" },
    { src: art("chain-feature"), label: "Blockchain voting" },
    { src: art("snn-chip"), label: "Neuromorphic efficiency" },
    { src: art("m-research"), label: "Research & papers" },
  ],
];

/** Per project: two stacked images, then the tall feature image. */
export const projectArtwork = [
  [art("video-gpu"), art("video-audio"), art("video-feature")],
  [art("mri-slices"), art("mri-network"), art("mri-feature")],
  [art("snn-raster"), art("snn-chip"), art("snn-feature")],
  [art("shadow-silhouettes"), art("shadow-voxels"), art("shadow-feature")],
  [art("chain-ballot"), art("chain-dashboard"), art("chain-feature")],
];

export const focusAreas = [
  {
    title: "Computer vision",
    description:
      "Production CV models in PyTorch at Dextora, plus a peer-reviewed paper on real-time object detection with YOLO (ICPEDC ’25).",
  },
  {
    title: "Medical image analysis",
    description:
      "Hybrid deep-feature fusion for brain-tumour MRI: VGG16 with Squeeze-and-Excitation attention, GLCM radiomics and geometric-mean stacking.",
  },
  {
    title: "Generative AI",
    description:
      "Fine-tuning an open-weight MiniMax image-to-video model on a multi-GPU A100 cluster, wired to LLMs, neural TTS and Whisper captions.",
  },
  {
    title: "Energy-efficient AI",
    description:
      "Label-free early exits for unsupervised STDP spiking neural networks, cutting inference energy up to 16.2× with lossless 4-bit synapses.",
  },
  {
    title: "Embedded intelligence",
    description:
      "ML-based anomaly detection for predictive cell-fault identification in a high-voltage TI BQ76952 + STM32 battery management system.",
  },
];

export type Project = {
  title: string;
  category: string;
  period: string;
  description: string;
  technologies: string[];
  stats: { value: string; label: string }[];
  repo?: string;
  status?: string;
};

export const projects: Project[] = [
  {
    title: "Autonomous AI Video Generation Pipeline",
    category: "Generative AI · Production",
    period: "2026",
    description:
      "A fully autonomous five-stage pipeline — trends → LLM script → assets → edit → publish — built on the YouTube Data API and Claude. It runs daily with no manual steps and is now used by multiple creators to run their channels.",
    technologies: ["PyTorch", "Hugging Face", "A100 GPUs", "LLMs", "FFmpeg", "Whisper"],
    stats: [
      { value: "5", label: "autonomous stages" },
      { value: "A100", label: "multi-GPU fine-tuning" },
      { value: "Daily", label: "hands-free publishing" },
    ],
    repo: "video_gen",
  },
  {
    title: "Brain-Tumour MRI Classifier",
    category: "Medical imaging · Research",
    period: "Jun – Oct 2025",
    description:
      "A hybrid deep-feature-fusion classifier: VGG16 + Squeeze-and-Excitation attention fused with GLCM radiomics, 4-way test-time augmentation and geometric-mean stacking. Paper under peer review.",
    technologies: ["Python", "PyTorch", "VGG16", "SE attention", "GLCM radiomics"],
    stats: [
      { value: "92.44%", label: "test accuracy" },
      { value: "7,200", label: "MRI scans · 4 classes" },
      { value: "100%", label: "no-tumour recall" },
    ],
    repo: "Brain-Tumor-Detection-ML-model",
  },
  {
    title: "Energy-Efficient Spiking Neural Networks",
    category: "Final-year thesis · Neuromorphic AI",
    period: "Mar 2026 – Present",
    description:
      "A label-free, parameter-free early exit for unsupervised STDP spiking networks, validated on three datasets with bootstrap confidence intervals — at under 0.5 pp accuracy loss.",
    technologies: ["Python", "PyTorch", "BrainCog", "STDP"],
    stats: [
      { value: "16.2×", label: "energy cut · KMNIST" },
      { value: "11.7×", label: "energy cut · MNIST" },
      { value: "4-bit", label: "lossless synapses" },
    ],
    status: "Thesis in progress",
  },
  {
    title: "Deep-Shadow Volumetry",
    category: "3D reconstruction · Deep learning",
    period: "Jan 2026",
    description:
      "A CNN pipeline that reconstructs 3D volumetric shapes from 2D shadow projections, trained on a large synthetic dataset generated with Blender scripting across diverse lighting conditions.",
    technologies: ["Python", "PyTorch", "CNNs", "Blender"],
    stats: [
      { value: "2D → 3D", label: "shadow-to-volume" },
      { value: "Synthetic", label: "Blender-scripted data" },
    ],
    repo: "DEEP-SHADOW-VOLUMETRY",
  },
  {
    title: "Blockchain-Based Voting System",
    category: "Web3 · Full stack",
    period: "Nov 2024",
    description:
      "An Ethereum smart-contract DApp for immutable votes, with a Spring Boot backend, MetaMask authentication via Web3.js and a real-time React dashboard.",
    technologies: ["React.js", "Solidity", "Spring Boot", "Web3.js"],
    stats: [
      { value: "On-chain", label: "immutable ballots" },
      { value: "Live", label: "real-time dashboard" },
    ],
  },
];

export const experience = [
  {
    date: "Feb 2025 — Present",
    title: "Machine Learning Intern",
    organization: "Dextora",
    location: "Lucknow, India · Remote",
    points: [
      "Develop and optimise production computer-vision and deep-learning models in PyTorch, and the training-to-deployment pipelines that ship them.",
      "Designed and built the company’s autonomous AI video-generation pipeline, taking a video from trend discovery to a published YouTube upload daily with no manual steps.",
    ],
  },
  {
    date: "Jan 2025 — Present",
    title: "Core Electronics Member & BMS Engineer",
    organization: "Dromos Hyperloop Team · VIT Chennai",
    location: "Chennai, India",
    points: [
      "Won Best Electrical System & Best Embedded System at GHC ’26 (IIT Madras); Vacuum Tube Runner-Up.",
      "Architected a high-voltage master–slave Battery Management System (TI BQ76952 + STM32) with ML-based anomaly detection for predictive cell-fault identification.",
      "Designed safety-critical circuits for real-time cell balancing, thermal monitoring and CAN communication.",
    ],
  },
  {
    date: "Jun 2025 — Oct 2025",
    title: "Research Intern",
    organization: "VIT Chennai · under Dr. Sunil Kumar Pradhan",
    location: "Chennai, India",
    points: [
      "Built a hybrid deep-feature-fusion brain-tumour MRI classifier: VGG16 + Squeeze-and-Excitation attention fused with GLCM radiomics, 4-way test-time augmentation and geometric-mean stacking.",
      "Reached 92.44% test accuracy on a 7,200-scan four-class MRI dataset, with 93% glioma precision and 100% no-tumour recall; paper under peer review.",
    ],
  },
];

export const education = [
  {
    school: "Vellore Institute of Technology (VIT)",
    detail: "B.Tech, Electronics & Computer Engineering",
    score: "CGPA 8.01 / 10",
    meta: "Chennai · 2023 — 2027",
  },
  {
    school: "Sanskriti Junior College",
    detail: "Class XII (Intermediate)",
    score: "97.2%",
    meta: "Tirupati · 2023",
  },
  {
    school: "Sri Chaitanya Techno School",
    detail: "Class X (SSC)",
    score: "98%",
    meta: "Tirupati · 2021",
  },
];

export const publications = [
  {
    title:
      "Hybrid Deep Feature Fusion and Geometric Stacking for High-Sensitivity Brain Tumor MRI Classification",
    meta: "B. Yagnesh, S. Tenneti · Under peer review · 2026",
  },
  {
    title: "Real-Time Object Detection Using YOLO Algorithm",
    meta: "Peer-reviewed paper · ICPEDC ’25 · SSN College",
  },
];

export const skills = [
  {
    group: "Machine learning",
    items: [
      "PyTorch",
      "CNNs",
      "Computer Vision",
      "Transfer & Ensemble Learning",
      "Medical Imaging",
      "SNNs",
    ],
  },
  {
    group: "Generative AI",
    items: [
      "Image-to-Video Fine-tuning (MiniMax)",
      "Hugging Face",
      "Multi-GPU (A100)",
      "LLM APIs",
      "TTS",
      "Whisper",
    ],
  },
  {
    group: "Languages",
    items: ["Python (Advanced)", "C", "C++", "Java", "Verilog", "SystemVerilog", "Solidity"],
  },
  {
    group: "Tools & hardware",
    items: [
      "Git",
      "GitHub Actions",
      "FFmpeg",
      "Blender",
      "MATLAB",
      "STM32",
      "CAN",
      "PCB",
      "RTL",
      "FPGA/ASIC",
    ],
  },
];
