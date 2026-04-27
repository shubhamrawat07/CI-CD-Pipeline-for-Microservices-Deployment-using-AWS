pipeline {
    agent any

    environment {
        DOCKERHUB = "rshubham07"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build user-service') {
            steps {
                sh 'docker build -t $DOCKERHUB/user-service:latest ./user-service'
            }
        }

        stage('Build product-service') {
            steps {
                sh 'docker build -t $DOCKERHUB/product-service:latest ./product-service'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    docker push $DOCKERHUB/user-service:latest
                    docker push $DOCKERHUB/product-service:latest
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG_FILE')]) {
                    sh '''
                        export KUBECONFIG=$KUBECONFIG_FILE
                        kubectl apply -f k8s/
                        kubectl rollout status deployment/user-service
                        kubectl rollout status deployment/product-service
                    '''
                }
            }
        }
    }
}
