import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export function TestLearningStyle() {
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testMessages = {
    visual:
      "Me gusta ver diagramas y gráficos para entender mejor los conceptos. Prefiero usar imágenes y mapas conceptuales.",
    auditory:
      "Aprendo mejor cuando escucho explicaciones y participo en debates. Me gusta discutir ideas con otros.",
    reading:
      "Prefiero leer textos y escribir resúmenes. Me gusta tomar notas detalladas y crear listas.",
    kinesthetic:
      "Aprendo mejor haciendo experimentos y proyectos prácticos. Me gusta tocar y manipular objetos.",
  };

  const handleTest = async () => {
    if (!message || !studentId) {
      alert("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/test-learning-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, studentId }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickTest = (style) => {
    setMessage(testMessages[style]);
    setStudentId("test-student-" + Math.random().toString(36).substr(2, 9));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          🧪 Prueba de Detección de Estilos de Aprendizaje
        </h1>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pruebas Rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={() => handleQuickTest("visual")} variant="outline">
              👁️ Visual
            </Button>
            <Button
              onClick={() => handleQuickTest("auditory")}
              variant="outline"
            >
              👂 Auditivo
            </Button>
            <Button
              onClick={() => handleQuickTest("reading")}
              variant="outline"
            >
              📖 Lectura
            </Button>
            <Button
              onClick={() => handleQuickTest("kinesthetic")}
              variant="outline"
            >
              ✋ Kinestésico
            </Button>
          </div>
        </Card>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Prueba Personalizada</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="studentId">ID del Estudiante</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Ej: estudiante-123"
              />
            </div>
            <div>
              <Label htmlFor="message">Mensaje del Estudiante</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe aquí lo que diría un estudiante..."
                rows={4}
              />
            </div>
            <Button onClick={handleTest} disabled={loading} className="w-full">
              {loading ? "Analizando..." : "Probar Detección"}
            </Button>
          </div>
        </Card>

        {result && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Resultado</h2>
            {result.success ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-semibold text-green-800">
                    ✅ Estilo Detectado:
                  </h3>
                  <p className="text-green-700 text-lg">
                    {result.detectedStyle || "No se detectó un estilo claro"}
                  </p>
                </div>

                {result.analysis && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800">
                      📊 Análisis:
                    </h3>
                    <pre className="text-blue-700 text-sm whitespace-pre-wrap">
                      {JSON.stringify(result.analysis, null, 2)}
                    </pre>
                  </div>
                )}

                {result.suggestions && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h3 className="font-semibold text-purple-800">
                      💡 Sugerencias:
                    </h3>
                    <pre className="text-purple-700 text-sm whitespace-pre-wrap">
                      {JSON.stringify(result.suggestions, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800">❌ Error:</h3>
                <p className="text-red-700">{result.error}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
