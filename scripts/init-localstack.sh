#!/bin/bash

echo "⌛️ Aguardando LocalStack subir..."
sleep 5

echo "🚀 Criando fila products-queue"
awslocal sqs create-queue --queue-name products-queue
