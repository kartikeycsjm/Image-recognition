"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Upload, ImageIcon } from "lucide-react"

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/-BDm5wzk0/"

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [results, setResults] = useState<string[]>([])
  const [model, setModel] = useState<any>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // Load TensorFlow + TeachableMachine scripts
    const loadScripts = async () => {
      const tfScript = document.createElement("script")
      tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"
      tfScript.async = true

      const tmScript = document.createElement("script")
      tmScript.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"
      tmScript.async = true

      tfScript.onload = () => {
        tmScript.onload = async () => {
          const tmImage = (window as any).tmImage
          const loadedModel = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json")
          setModel(loadedModel)
        }
        document.body.appendChild(tmScript)
      }
      document.body.appendChild(tfScript)
    }

    loadScripts()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResults([])
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePredict = async () => {
    if (!model || !imageRef.current) return
    const prediction = await model.predict(imageRef.current)
    const formatted = prediction.map((p: any) => `${p.className}: ${p.probability.toFixed(2)}`)
    setResults(formatted)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">AI Image Classifier</h1>
          <p className="text-gray-600">Upload an image to see what the AI recognizes</p>
        </div>

        {/* Upload Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Upload Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {imageSrc && (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      ref={imageRef}
                      src={imageSrc || "/placeholder.svg"}
                      alt="Uploaded"
                      className="max-w-full max-h-80 object-contain rounded-lg border-2 border-gray-200 shadow-lg"
                    />
                  </div>
                  <Button onClick={handlePredict} className="w-full" size="lg">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Predict
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Card */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Prediction Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.map((result, i) => {
                  const [className, probability] = result.split(": ")
                  const confidence = Number.parseFloat(probability)
                  const percentage = Math.round(confidence * 100)

                  return (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{className}</span>
                      <Badge variant={percentage > 50 ? "default" : "secondary"} className="ml-2">
                        {percentage}%
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!imageSrc && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">Choose an image file to get started with AI classification</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
