"use client"

import { useRef } from "react"
import { MoreVertical, Expand, Minimize2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CodingChallenge as CodingChallengeType, ProgrammingLanguage } from "./types"

interface CodingChallengeProps {
  challenges: CodingChallengeType[]
  programmingLanguages: ProgrammingLanguage[]
  selectedChallenge: CodingChallengeType
  selectedLanguage: string
  code: string
  codeOutput: string | null
  isRunningCode: boolean
  fullscreenCode: boolean
  onSelectChallenge: (challenge: CodingChallengeType) => void
  onLanguageChange: (language: string) => void
  onCodeChange: (code: string) => void
  onRunCode: () => void
  onResetCode: () => void
  onToggleFullscreen: () => void
}

export default function CodingChallenge({
  challenges,
  programmingLanguages,
  selectedChallenge,
  selectedLanguage,
  code,
  codeOutput,
  isRunningCode,
  fullscreenCode,
  onSelectChallenge,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  onResetCode,
  onToggleFullscreen,
}: CodingChallengeProps) {
  const codeEditorRef = useRef<HTMLTextAreaElement>(null)

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{selectedChallenge.title}</h3>
            <Badge
              variant={
                selectedChallenge.difficulty === "Easy"
                  ? "outline"
                  : selectedChallenge.difficulty === "Medium"
                    ? "secondary"
                    : "destructive"
              }
            >
              {selectedChallenge.difficulty}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  Select Challenge <MoreVertical className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {challenges.map((challenge) => (
                  <DropdownMenuItem key={challenge.id} onClick={() => onSelectChallenge(challenge)}>
                    <span className="mr-2">{challenge.title}</span>
                    <Badge
                      variant={
                        challenge.difficulty === "Easy"
                          ? "outline"
                          : challenge.difficulty === "Medium"
                            ? "secondary"
                            : "destructive"
                      }
                      className="ml-auto"
                    >
                      {challenge.difficulty}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{selectedChallenge.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {programmingLanguages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-1 rounded text-xs font-mono">{lang.icon}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
            {fullscreenCode ? <Minimize2 className="h-4 w-4" /> : <Expand className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 p-4 bg-muted/30 overflow-auto">
          <div className="bg-background border rounded-md h-full flex flex-col">
            <div className="p-2 border-b bg-muted/50 text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-muted px-1 rounded text-xs font-mono">
                  {programmingLanguages.find((lang) => lang.id === selectedLanguage)?.icon}
                </span>
                <span>{programmingLanguages.find((lang) => lang.id === selectedLanguage)?.name}</span>
              </div>
            </div>
            <textarea
              ref={codeEditorRef}
              value={code}
              onChange={(e) => onCodeChange(e.target.value)}
              className="w-full flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l flex flex-col">
          <div className="p-2 border-b bg-muted/50 text-sm font-medium">Test Cases</div>
          <div className="p-4 overflow-y-auto flex-1">
            <ul className="space-y-3">
              {selectedChallenge.testCases.map((testCase: any, index: number) => (
                <li key={index} className="text-sm">
                  <div className="font-medium">Test {index + 1}:</div>
                  <div className="mt-1 space-y-1">
                    <div>
                      <span className="text-muted-foreground">Input: </span>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {typeof testCase.input === "object" ? JSON.stringify(testCase.input) : testCase.input}
                      </code>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected: </span>
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">{JSON.stringify(testCase.expected)}</code>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {codeOutput && (
            <div className="border-t">
              <div className="p-2 border-b bg-muted/50 text-sm font-medium">Output</div>
              <pre className="p-4 text-xs font-mono overflow-auto max-h-[200px] whitespace-pre-wrap">{codeOutput}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t sticky bottom-0 bg-background flex justify-between">
        <Button variant="outline" onClick={onResetCode}>
          Reset Code
        </Button>
        <Button onClick={onRunCode} disabled={isRunningCode}>
          {isRunningCode ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            "Run Tests"
          )}
        </Button>
      </div>
    </div>
  )
}

