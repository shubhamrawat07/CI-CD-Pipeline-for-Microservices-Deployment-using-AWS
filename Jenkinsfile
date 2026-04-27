pipeline {
    agent any

    environment {
        BUILD_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Build User Service') {
            steps {
                sh 'docker build -t rshubham07/user-service:${BUILD_TAG} ./user-service'
            }
        }

        stage('Push User Service') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push rshubham07/user-service:${BUILD_TAG}'
                }
            }
        }

        stage('Build Product Service') {
            steps {
                sh 'docker build -t rshubham07/product-service:${BUILD_TAG} ./product-service'
            }
        }

        stage('Push Product Service') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                    sh 'docker push rshubham07/product-service:${BUILD_TAG}'
                }
            }
        }

        stage('Deploy User Service') {
            steps {
                sh 'kubectl set image deployment/user-service user=rshubham07/user-service:${BUILD_TAG}'
            }
        }

        stage('Deploy Product Service') {
            steps {
                sh 'kubectl set image deployment/product-service product=rshubham07/product-service:${BUILD_TAG}'
            }
        }
    }

    post {
    always {
        sh 'docker logout || true'
    }
    success {
        sh '''
            # Kill anything on port 3000 and 3001 forcefully
            docker ps -q --filter "publish=3000" | xargs -r docker stop
            docker ps -q --filter "publish=3001" | xargs -r docker stop
            
            # Remove named containers if they exist
            docker rm -f user-service-local || true
            docker rm -f product-service-local || true

            # Small wait to ensure ports are freed
            sleep 2

            # Run fresh containers
            docker run -d --name user-service-local -p 3000:3000 rshubham07/user-service:${BUILD_TAG}
            docker run -d --name product-service-local -p 3001:3000 rshubham07/product-service:${BUILD_TAG}
        '''
    }
}
}
