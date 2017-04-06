<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit41dec1d8e51b2cc51dddc2b1efe9e907
{
    public static $prefixLengthsPsr4 = array (
        'A' => 
        array (
            'App\\' => 4,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'App\\' => 
        array (
            0 => __DIR__ . '/../..' . '/app',
        ),
    );

    public static $classMap = array (
        'App\\Config' => __DIR__ . '/../..' . '/app/Config.php',
        'App\\SQLiteConnection' => __DIR__ . '/../..' . '/app/SQLiteConnection.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit41dec1d8e51b2cc51dddc2b1efe9e907::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit41dec1d8e51b2cc51dddc2b1efe9e907::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInit41dec1d8e51b2cc51dddc2b1efe9e907::$classMap;

        }, null, ClassLoader::class);
    }
}
