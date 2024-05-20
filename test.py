import wandb

api = wandb.Api()

sweep = api.sweep("chltmdgh522/news-summ/<vivid-mountain-2>")
runs = sorted(sweep.runs,
              key=lambda run: run.summary.get("val_acc", 0), reverse=True)
val_acc = runs[0].summary.get("val_acc", 0)
print(f"Best run {runs[0].name} with {val_acc}% validation accuracy")

runs[0].file("model.h5").download(replace=True)
print("Best model saved to model-best.h5")
