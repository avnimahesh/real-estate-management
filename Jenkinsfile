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
        AWS_ACCOUNT_ID="979022608152"
        AWS_DEFAULT_REGION="us-west-1"
        BRANCH_NAME="avni_development"
        IMAGE_REPO_NAME="real-estate.avni"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    }
 
    stages {
 
        stage('Logging into AWS ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    sh "docker ps -a -q | xargs docker rm -f || true"
                    sh "docker images -a -q | xargs docker rmi -f || true"
                }
 
            }
        }
 
 
 // Building Docker images
        stage('Building images') {
            steps{
                script {
                    sh "echo $HOME && pwd"
                    sh "cd frontend"
                    env.git_commit_sha = sh(script: 'git rev-parse --short=6 HEAD', returnStdout: true).trim( )
                    sh "docker build -t ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_frontend ."
                    sh "cd backend-fastify"
                    env.git_commit_sha = sh(script: 'git rev-parse --short=6 HEAD', returnStdout: true).trim( )
                    sh "docker build -t ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_backend ."
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
                    sh "ssh ubuntu@54.67.78.130 /home/ubuntu/login-ecr.sh"
                    sh "ssh ubuntu@54.67.78.130 sudo docker rm -f ${IMAGE_REPO_NAME}-${BRANCH_NAME} || true"
                    sh "ssh ubuntu@54.67.78.130 sudo docker images -a -q | xargs docker rmi -f || true"
                    sh "ssh ubuntu@54.67.78.130 sudo docker run -itd --name ${IMAGE_REPO_NAME}-${BRANCH_NAME}front1 -p 4200:4200 --restart always ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_frontend"
                    sh "ssh ubuntu@54.67.78.130 sudo docker run -itd --name ${IMAGE_REPO_NAME}-${BRANCH_NAME}back1 -p 8000:8000 --restart always ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}.app_backend"
                }
            }
        }
    }
}
