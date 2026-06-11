Benchmarking Cell Segmentation Models for Computational Pathology
Published: 2026-04-15

Not all segmentation models are created equal — especially when
your ground truth comes from immunofluorescence and your input
is H&E. During my thesis at Human Technopole I benchmarked
StarDist, CellViT++, and Cellpose on colon tissue from IBD donors,
then trained a custom U-Net on paired IF tiles.

The gap was stark: ~30% neutrophil recall from off-the-shelf models,
99% from the fine-tuned U-Net. This post walks through what I
tested, what failed, and what actually mattered.

tags: computer-vision, segmentation, bioinformatics, deep-learning