pipeline {
    agent any
    
    tools {nodejs "nodejs 18.16.0"}

    stages {
        stage('Checkout SCM') {
            steps {
                git branch: 'main', url: 'https://github.com/viruscoromna-hub/simple-apps.git'
            }
        }
        stage('Build') {
            steps {
                sh '''cd apps
                npm install'''
            }
        }
        stage('Testing') {
            steps {
                sh '''cd apps
                npm test
                npm run test:coverage'''
            }
        }
        stage('Code Review') {
            steps {
                sh '''sonar \
                    -Dsonar.host.url=http://172.23.13.112:9000 \
                    -Dsonar.token=sqp_1a20a99127d5b9d5b83141541f401b8523dfa4e7 \
                    -Dsonar.projectKey=simple-apps'''
            }
        }
        stage('Deploy compose') {
            steps {
                sh '''
                docker compose build
                docker compose up -d
                '''
            }
        }
    }
}