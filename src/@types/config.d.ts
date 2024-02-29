interface AppConfig {
    user_session?: string;
    player_config?: string;
}

interface PlayerConfig {
    volume: number;
    mute: boolean;
    shuffle: boolean;
    repeat: "none" | "one" | "all";
}
