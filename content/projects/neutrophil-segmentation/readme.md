readme.md:
thesis — Neutrophil Segmentation in IBD Colonic Biopsies
Human Technopole, Glastonbury Group · 2025–2026

Computational framework for cell type identification and segmentation
in human colon tissue, integrating H&E histology, immunofluorescence,
and spatial transcriptomics across 3 donors (healthy, UC, Crohn's).

highlights:
- Benchmarked & fine-tuned StarDist, CellViT++, Cellpose
- Custom U-Net on IF-paired H&E tiles → 99% neutrophil accuracy
  vs ~30% from standard models
- Benchmarked 5 transcript assignment pipelines (Bin2Cell, Thor,
  Enact, Smurf, SpaceRanger)
- CellTypist deconvolution on pathologist-annotated genes → 63%
  neutrophil recall from transcriptomics alone
- Evaluated DINOBloom, UNI, ResNet, EfficientNet for cell morphology

stack: Python, PyTorch, TensorFlow, scikit-learn, OpenCV, Scanpy, Squidpy