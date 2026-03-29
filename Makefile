# Get these from Vercel dashboard → Project Settings → General
PROD_PROJECT_ID=YOUR_PROD_PROJECT_ID
DEV_PROJECT_ID=YOUR_DEV_PROJECT_ID
ORG_ID=team_VHFsErZXMQCfxQuwQtou9r7t

deploy-prod:
	@echo "Deploying to PRODUCTION..."
	@mkdir -p .vercel
	@echo '{"projectId":"$(PROD_PROJECT_ID)","orgId":"$(ORG_ID)","projectName":"riderstrun-webapp"}' > .vercel/project.json
	vercel --prod --yes
	@echo "Done → https://riderstrun-webapp.vercel.app"

deploy-dev:
	@echo "Deploying to DEV..."
	@mkdir -p .vercel
	@echo '{"projectId":"$(DEV_PROJECT_ID)","orgId":"$(ORG_ID)","projectName":"riderstrun-webapp-dev"}' > .vercel/project.json
	vercel --prod --yes
	@echo '{"projectId":"$(PROD_PROJECT_ID)","orgId":"$(ORG_ID)","projectName":"riderstrun-webapp"}' > .vercel/project.json
	@echo "Done → https://riderstrun-webapp-dev.vercel.app"

.PHONY: deploy-prod deploy-dev
