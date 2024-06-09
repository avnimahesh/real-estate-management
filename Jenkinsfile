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
        AWS_DEFAULT_REGION="us-east-1"
        BRANCH_NAME="avni_development"
        IMAGE_REPO_NAME="real-estate.avni"
        REPOSITORY_URI = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com/${IMAGE_REPO_NAME}"
    }
 
    stages {
 
        stage('Logging into AWS ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | sudo docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION}.amazonaws.com"
                    sh "docker images -a -q | xargs docker rmi -f || true"
                }
 
            }
        }
 
 
 // Building Docker images
        stage('Building image') {
            steps{
                script {
                    env.git_commit_sha = sh(script: 'git rev-parse --short=6 HEAD', returnStdout: true).trim( )
                    sh "docker build -t ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha} ."
                }
            }
        }
 
 // Uploading Docker images into AWS ECR
        stage('Pushing to ECR') {
            steps{ 
                script {
                    sh "docker push ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}"
                }
            }
        }

 //Creating container 
        stage('creating container for ladingpage') {
            steps{ 
                script {
                    sh "ssh ubuntu@54.67.78.130 /home/ubuntu/login-ecr.sh"
                    sh "ssh ubuntu@54.67.78.130 sudo docker rm -f ${IMAGE_REPO_NAME}-${BRANCH_NAME} || true"
                    sh "ssh ubuntu@54.67.78.130 sudo docker images -a -q | xargs docker rmi -f || true"
                    sh "ssh ubuntu@54.67.78.130 sudo docker run -itd --name ${IMAGE_REPO_NAME}-${BRANCH_NAME} -p 9090:80 --restart always ${REPOSITORY_URI}:${BRANCH_NAME}-${env.git_commit_sha}"
                }
            }
        }
    }
}
