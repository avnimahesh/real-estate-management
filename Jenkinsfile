pipeline {
    agent any

    /* parameters {
        string(
            name: 'AWS_ACCOUNT_ID',
            description: 'Account ID of the AWS you want to build'
        ),
        string(
            name: 'AWS_DEFAULT_REGION',
            description: 'Name of the Region you want to build'
        ),
        string(
            name: 'BRANCH_NAME',
            description: 'Name of the branch you want to build'
        )

    }*/

    environment {
        AWS_ACCOUNT_ID="791100541706"
        AWS_DEFAULT_REGION="us-east-1"
        BRANCH_NAME="avni_development"
        IMAGE_REPO_NAME="real-estate-management"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    }
 
    stages {
 
        stage('Logging into AWS ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    sh "docker images -a -q | xargs docker rmi -f || true"
                }
 
            }
        }
 
 
 // Building Docker images
        stage('Building images') {
            steps{
                script {
                    env.git_commit_sha = sh(script: 'git rev-parse --short=6 HEAD', returnStdout: true).trim( )
                    sh "docker build -t ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_frontend -f $HOME/workspace/real-estate-management/frontend/Dockerfile $HOME/workspace/real-estate-management/frontend/"
                    env.git_commit_sha = sh(script: 'git rev-parse --short=6 HEAD', returnStdout: true).trim( )
                    sh "docker build -t ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_backend -f $HOME/workspace/real-estate-management/backend-fastify/Dockerfile $HOME/workspace/real-estate-management/backend-fastify/"
                }
            }
        }
 
 // Uploading Docker images into AWS ECR
        stage('Pushing to ECR') {
            steps{ 
                script {
                    sh "docker push ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_frontend"
                    sh "docker push ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_backend"
                }
            }
        }

 //Creating container 
        stage('Creating container for Frontend and backend') {
            steps{ 
                script {
                    sh "sh $HOME/login-ecr.sh"
                    sh "docker ps -a -q | xargs docker rm -f || true"
                    sh "docker images -a -q | xargs docker rmi -f || true"
                    sh "echo y | docker system prune"
                    sh "docker run -itd --name ${IMAGE_REPO_NAME}-${BRANCH_NAME}_front1 -p 4200:4200 --restart always ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_frontend"
                    sh "docker run -itd --name ${IMAGE_REPO_NAME}-${BRANCH_NAME}_back1 -p 8000:8000 --restart always ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_backend"
                }
            }
        }
    }
}
