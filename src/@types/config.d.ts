interface AppConfig {
    user_session?: string;
    player_config?: string;
    config?: string;
}

interface PlayerConfig {
    volume: number;
    mute: boolean;
    shuffle: boolean;
    repeat: "none" | "one" | "all";
}

interface Config {
    autoNormalize: boolean;
    equalizer: TEqualizerValue;
}

interface TEqualizerValue {
    "60Hz": number;
    "150Hz": number;
    "400Hz": number;
    "1kHz": number;
    "2.4kHz": number;
    "15kHz": number;
}
