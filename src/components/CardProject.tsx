import Image from "next/image";
import { useEffect, useState } from "react";
import { Project } from "@models/project";
import { Repository } from "@models/repository";
import sRepository from "@services/RepositoryService";
import { useTranslation } from "next-i18next";

interface Props {
  project: Project,
  priority: boolean
}

export default function CardProject ({ project, priority }: Props) {
  const { t } = useTranslation();
  const [repository, setRepository] = useState<Repository>()
  const [hasImages, setHasImages] = useState<boolean>(false)

  useEffect(() => {
    setHasImages(project.images.length > 0)
  }, [project.images])

  useEffect(() => {
    sRepository.byName(project.github_name)
      .then(data => {
        setRepository(data)
      })
  }, [project.github_name])

  return (
    <div className='flex flex-col border-2 dark:border-neutral-700 rounded-xl overflow-hidden'>
      {hasImages && (
        <div className="relative w-full pt-[56.25%]">
          <Image src={project.images[0]} layout="fill" objectFit="cover" priority={priority} alt="desc" draggable="false" />
        </div>
      )}
      <div className={`flex-grow flex flex-col p-4 pt-3 ${hasImages && 'border-t-2 dark:border-neutral-700'}`}>
        <h1 className="text-md font-bold">{project.name}</h1>
        <p className="text-sm flex-grow">{repository?.description}</p>
        <div className="break-words space-x-2 text-xs text-gray-400">
          {repository?.topics.map(topic => (
            <a key={topic}>#{topic}</a>
          ))}
        </div>
        <div className="flex gap-4 mt-2 text-sm">
          <a className="flex items-center gap-1 hover:underline" href={repository?.html_url} target="_blank" rel="noreferrer">
            <div className="h-4 w-4 relative dark:invert">
              <Image src={`/svg/github.svg`} layout="fill" alt="source" />
            </div>
            {t('source')}
          </a>
          {project.demo && (
            <a className="flex items-center gap-1 hover:underline" href={repository?.homepage} target="_blank" rel="noreferrer">
              <div className="h-4 w-4 relative">
                <Image src={`/svg/coding.svg`} layout="fill" alt="demo" />
              </div>
              Demo
            </a>
          )}
          {project.npm && (
            <a className="flex items-center gap-1 hover:underline" href={project.npm} target="_blank" rel="noreferrer">
              <div className="h-4 w-4 relative">
                <Image src={`/svg/npm.svg`} layout="fill" alt="npm" />
              </div>
              npm
            </a>
          )}
        </div>
      </div>
    </div>
  )
}