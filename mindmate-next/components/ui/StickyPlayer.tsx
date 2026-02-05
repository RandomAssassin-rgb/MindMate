'use client';

import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
    Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
    ChevronUp, ChevronDown, X, Clock
} from 'lucide-react';

interface Track {
    id: string;
    title: string;
    category: string;
    duration_sec: number;
    thumbnail?: string;
}

interface StickyPlayerProps {
    track: Track | null;
    isPlaying: boolean;
    progress: number;
    onPlayPause: () => void;
    onClose: () => void;
    onSeek?: (progress: number) => void;
    onSkipBack?: () => void;
    onSkipForward?: () => void;
}

const PlayerRoot = styled(motion.div)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background: #FFFFFF;
  border-top: 1px solid rgba(17,24,39,0.08);
  box-shadow: 0 -4px 24px rgba(17,24,39,0.08);
`;

const PlayerProgress = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(17,24,39,0.08);
  cursor: pointer;
  
  &:hover {
    height: 5px;
  }
`;

const PlayerProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, #FF6A09, #FFD36A);
  border-radius: 0 2px 2px 0;
`;

const PlayerInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px 32px;
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    gap: 12px;
  }
`;

const TrackThumbnail = styled.div<{ src?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: ${({ src }) => src ? `url(${src}) center/cover` : 'linear-gradient(135deg, #FF6A09, #FFD36A)'};
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(17,24,39,0.1);
  
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 8px;
  }
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const TrackTitle = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TrackMeta = styled.div`
  font-size: 13px;
  color: #6B6F76;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TimeDisplay = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.button<{ primary?: boolean; size?: 'sm' | 'md' }>`
  width: ${({ size }) => size === 'sm' ? '36px' : '44px'};
  height: ${({ size }) => size === 'sm' ? '36px' : '44px'};
  border-radius: 50%;
  border: none;
  background: ${({ primary }) => primary ? 'linear-gradient(135deg, #FF6A09, #E85E00)' : 'rgba(17,24,39,0.06)'};
  color: ${({ primary }) => primary ? 'white' : '#374151'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 180ms cubic-bezier(.2,.9,.2,1);
  box-shadow: ${({ primary }) => primary ? '0 4px 14px rgba(255,106,9,0.35)' : 'none'};
  
  &:hover {
    transform: scale(1.08);
    background: ${({ primary }) => primary ? 'linear-gradient(135deg, #E85E00, #D45500)' : 'rgba(17,24,39,0.1)'};
    box-shadow: ${({ primary }) => primary ? '0 8px 24px rgba(255,106,9,0.45)' : 'none'};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 640px) {
    &.hide-mobile {
      display: none;
    }
  }
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const VolumeSlider = styled.input`
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background: rgba(17,24,39,0.1);
  appearance: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #FF6A09;
    cursor: pointer;
    transition: transform 150ms;
    
    &:hover {
      transform: scale(1.2);
    }
  }
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #9CA3AF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 180ms;
  
  &:hover {
    background: rgba(17,24,39,0.06);
    color: #374151;
  }
`;

// Mobile expanded player
const ExpandedPlayer = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: linear-gradient(180deg, #FFF7F2 0%, #FFFFFF 100%);
  z-index: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ExpandedThumbnail = styled.div<{ src?: string }>`
  width: 280px;
  height: 280px;
  border-radius: 24px;
  background: ${({ src }) => src ? `url(${src}) center/cover` : 'linear-gradient(135deg, #FF6A09, #FFD36A)'};
  box-shadow: 0 24px 64px rgba(17,24,39,0.15);
  margin-bottom: 32px;
`;

const ExpandedTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 8px;
`;

const ExpandedCategory = styled.p`
  font-size: 16px;
  color: #6B6F76;
  margin-bottom: 32px;
`;

const ExpandedProgressBar = styled.div`
  width: 100%;
  max-width: 300px;
  height: 6px;
  background: rgba(17,24,39,0.1);
  border-radius: 3px;
  margin-bottom: 16px;
  cursor: pointer;
  overflow: hidden;
`;

const ExpandedProgressFill = styled.div<{ width: number }>`
  height: 100%;
  width: ${({ width }) => width}%;
  background: linear-gradient(90deg, #FF6A09, #FFD36A);
  border-radius: 3px;
`;

const ExpandedTimeRow = styled.div`
  width: 100%;
  max-width: 300px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #6B6F76;
  margin-bottom: 32px;
`;

const ExpandedControls = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ExpandedControlButton = styled(ControlButton)`
  width: ${({ primary }) => primary ? '72px' : '52px'};
  height: ${({ primary }) => primary ? '72px' : '52px'};
`;

const CollapseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(17,24,39,0.06);
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export function StickyPlayer({
    track,
    isPlaying,
    progress,
    onPlayPause,
    onClose,
    onSeek,
    onSkipBack,
    onSkipForward
}: StickyPlayerProps) {
    const [expanded, setExpanded] = useState(false);
    const [volume, setVolume] = useState(80);
    const [muted, setMuted] = useState(false);

    if (!track) return null;

    const currentTime = Math.floor((progress / 100) * track.duration_sec);

    return (
        <>
            <AnimatePresence>
                {!expanded && (
                    <PlayerRoot
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <PlayerProgress onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = ((e.clientX - rect.left) / rect.width) * 100;
                            onSeek?.(percent);
                        }}>
                            <PlayerProgressFill style={{ width: `${progress}%` }} />
                        </PlayerProgress>

                        <PlayerInner>
                            <TrackThumbnail src={track.thumbnail} onClick={() => setExpanded(true)} />

                            <TrackInfo onClick={() => setExpanded(true)}>
                                <TrackTitle>{track.title}</TrackTitle>
                                <TrackMeta>
                                    <span>{track.category}</span>
                                    <TimeDisplay>
                                        <Clock />
                                        {formatTime(currentTime)} / {formatTime(track.duration_sec)}
                                    </TimeDisplay>
                                </TrackMeta>
                            </TrackInfo>

                            <Controls>
                                <ControlButton
                                    size="sm"
                                    className="hide-mobile"
                                    onClick={onSkipBack}
                                    aria-label="Skip back"
                                >
                                    <SkipBack size={16} />
                                </ControlButton>

                                <ControlButton
                                    primary
                                    onClick={onPlayPause}
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: 2 }} />}
                                </ControlButton>

                                <ControlButton
                                    size="sm"
                                    className="hide-mobile"
                                    onClick={onSkipForward}
                                    aria-label="Skip forward"
                                >
                                    <SkipForward size={16} />
                                </ControlButton>
                            </Controls>

                            <VolumeControl>
                                <ControlButton
                                    size="sm"
                                    onClick={() => setMuted(!muted)}
                                    aria-label={muted ? 'Unmute' : 'Mute'}
                                >
                                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                </ControlButton>
                                <VolumeSlider
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={muted ? 0 : volume}
                                    onChange={(e) => {
                                        setVolume(parseInt(e.target.value));
                                        setMuted(false);
                                    }}
                                    aria-label="Volume"
                                    role="slider"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    aria-valuenow={volume}
                                />
                            </VolumeControl>

                            <CloseButton onClick={onClose} aria-label="Close player">
                                <X size={18} />
                            </CloseButton>
                        </PlayerInner>
                    </PlayerRoot>
                )}
            </AnimatePresence>

            {/* Mobile expanded view */}
            <AnimatePresence>
                {expanded && (
                    <ExpandedPlayer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <CollapseButton onClick={() => setExpanded(false)}>
                            <ChevronDown size={24} />
                        </CollapseButton>

                        <ExpandedThumbnail src={track.thumbnail} />

                        <ExpandedTitle>{track.title}</ExpandedTitle>
                        <ExpandedCategory>{track.category}</ExpandedCategory>

                        <ExpandedProgressBar onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const percent = ((e.clientX - rect.left) / rect.width) * 100;
                            onSeek?.(percent);
                        }}>
                            <ExpandedProgressFill width={progress} />
                        </ExpandedProgressBar>

                        <ExpandedTimeRow>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(track.duration_sec)}</span>
                        </ExpandedTimeRow>

                        <ExpandedControls>
                            <ExpandedControlButton onClick={onSkipBack}>
                                <SkipBack size={24} />
                            </ExpandedControlButton>

                            <ExpandedControlButton primary onClick={onPlayPause}>
                                {isPlaying ? <Pause size={32} /> : <Play size={32} style={{ marginLeft: 4 }} />}
                            </ExpandedControlButton>

                            <ExpandedControlButton onClick={onSkipForward}>
                                <SkipForward size={24} />
                            </ExpandedControlButton>
                        </ExpandedControls>
                    </ExpandedPlayer>
                )}
            </AnimatePresence>
        </>
    );
}

export default StickyPlayer;
