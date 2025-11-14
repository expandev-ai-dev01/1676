/**
 * Database Migration
 * Generated: 2025-11-14T19:42:44.175Z
 * Timestamp: 20251114_194244
 *
 * This migration includes:
 * - Schema structures (tables, indexes, constraints)
 * - Initial data
 * - Stored procedures
 *
 * Note: This file is automatically executed by the migration runner
 * on application startup in Azure App Service.
 */

-- Set options for better SQL Server compatibility
SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
SET ANSI_PADDING ON;
SET CONCAT_NULL_YIELDS_NULL ON;
SET ANSI_WARNINGS ON;
SET NUMERIC_ROUNDABORT OFF;
GO

PRINT 'Starting database migration...';
PRINT 'Timestamp: 20251114_194244';
GO


-- ============================================
-- STRUCTURE
-- Database schemas, tables, indexes, and constraints
-- ============================================

-- File: subscription/_structure.sql
/**
 * @schema subscription
 * Subscription and account management schema
 */
CREATE SCHEMA [subscription];
GO

/**
 * @table account Account management for multi-tenancy
 * @multitenancy false
 * @softDelete false
 * @alias acc
 */
CREATE TABLE [subscription].[account] (
  [idAccount] INTEGER IDENTITY(1, 1) NOT NULL,
  [name] NVARCHAR(200) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [active] BIT NOT NULL
);
GO

/**
 * @primaryKey pkAccount
 * @keyType Object
 */
ALTER TABLE [subscription].[account]
ADD CONSTRAINT [pkAccount] PRIMARY KEY CLUSTERED ([idAccount]);
GO

/**
 * @index ixAccount_Active Performance index for active accounts
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixAccount_Active]
ON [subscription].[account]([active])
WHERE [active] = 1;
GO

-- File: config/_structure.sql
/**
 * @schema config
 * System-wide configuration schema
 */
CREATE SCHEMA [config];
GO

/**
 * @table color Predefined color palette for notes
 * @multitenancy false
 * @softDelete false
 * @alias clr
 */
CREATE TABLE [config].[color] (
  [idColor] INTEGER IDENTITY(1, 1) NOT NULL,
  [name] NVARCHAR(50) NOT NULL,
  [hexCode] VARCHAR(7) NOT NULL
);
GO

/**
 * @primaryKey pkColor
 * @keyType Object
 */
ALTER TABLE [config].[color]
ADD CONSTRAINT [pkColor] PRIMARY KEY CLUSTERED ([idColor]);
GO

/**
 * @index uqColor_Name Ensures color names are unique
 * @type Unique
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqColor_Name]
ON [config].[color]([name]);
GO

/**
 * @index uqColor_HexCode Ensures hex codes are unique
 * @type Unique
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqColor_HexCode]
ON [config].[color]([hexCode]);
GO


-- File: functional/_structure.sql
/**
 * @schema functional
 * Business logic schema for NoteDB application
 */
CREATE SCHEMA [functional];
GO

/**
 * @table note Note storage table for user notes
 * @multitenancy true
 * @softDelete false
 * @alias nte
 */
CREATE TABLE [functional].[note] (
  [idNote] INTEGER IDENTITY(1, 1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idColor] INTEGER NOT NULL,
  [titulo] NVARCHAR(100) NOT NULL,
  [conteudo] NVARCHAR(MAX) NOT NULL,
  [dateCreated] DATETIME2 NOT NULL,
  [dateModified] DATETIME2 NOT NULL
);
GO

/**
 * @primaryKey pkNote
 * @keyType Object
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [pkNote] PRIMARY KEY CLUSTERED ([idNote]);
GO

/**
 * @foreignKey fkNote_Account Account isolation for multi-tenancy
 * @target subscription.account
 * @tenancy true
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [fkNote_Account] FOREIGN KEY ([idAccount])
REFERENCES [subscription].[account]([idAccount]);
GO

/**
 * @foreignKey fkNote_Color Links note to a color in the palette
 * @target config.color
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [fkNote_Color] FOREIGN KEY ([idColor])
REFERENCES [config].[color]([idColor]);
GO

/**
 * @default dfNote_IdColor Sets default color for new notes
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [dfNote_IdColor] DEFAULT (1) FOR [idColor];
GO

/**
 * @check chkNote_TituloLength Validates titulo length constraints
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [chkNote_TituloLength] CHECK (LEN([titulo]) >= 3 AND LEN([titulo]) <= 100);
GO

/**
 * @check chkNote_ConteudoLength Validates conteudo length constraints
 */
ALTER TABLE [functional].[note]
ADD CONSTRAINT [chkNote_ConteudoLength] CHECK (LEN([conteudo]) >= 1 AND LEN([conteudo]) <= 5000);
GO

/**
 * @index ixNote_Account Account-based filtering for multi-tenancy
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixNote_Account]
ON [functional].[note]([idAccount]);
GO

/**
 * @index ixNote_Account_DateModified Performance index for listing notes by modification date
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixNote_Account_DateModified]
ON [functional].[note]([idAccount], [dateModified] DESC)
INCLUDE ([titulo], [idColor]);
GO

/**
 * @index ixNote_Account_IdColor Performance index for filtering notes by color
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixNote_Account_IdColor]
ON [functional].[note]([idAccount], [idColor])
INCLUDE ([titulo], [dateModified]);
GO



-- ============================================
-- DATA
-- Initial data and configuration
-- ============================================

-- File: subscription/_data.sql
/**
 * @load account
 */
INSERT INTO [subscription].[account]
([name], [dateCreated], [active])
VALUES
('Default Account', GETUTCDATE(), 1);
GO

-- File: config/_data.sql
/**
 * @load color
 */
INSERT INTO [config].[color]
([name], [hexCode])
VALUES
('Neutro', '#FFFFFF'),
('Vermelho', '#FFDDE1'),
('Amarelo', '#FFFACD'),
('Verde', '#D4EDDA'),
('Azul', '#D1ECF1'),
('Roxo', '#E2D9F3');
GO



-- ============================================
-- STORED PROCEDURES
-- Database stored procedures and functions
-- ============================================

-- File: config/color/spColorList.sql
/**
 * @summary
 * Lists all available colors from the predefined palette.
 *
 * @procedure spColorList
 * @schema config
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/color
 *
 * @testScenarios
 * - Retrieve the complete list of colors
 */
CREATE OR ALTER PROCEDURE [config].[spColorList]
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @rule {db-color-listing} Retrieve all colors from the palette
   */
  /**
   * @output {ColorPalette, n, n}
   * @column {INT} idColor
   * - Description: Color identifier
   * @column {NVARCHAR(50)} name
   * - Description: Color name
   * @column {VARCHAR(7)} hexCode
   * - Description: Color hex code
   */
  SELECT
    [clr].[idColor],
    [clr].[name],
    [clr].[hexCode]
  FROM [config].[color] [clr]
  ORDER BY [clr].[idColor];
END;
GO


-- File: functional/note/spNoteColorStats.sql
/**
 * @summary
 * Calculates and returns the count of notes for each color for a specific account.
 *
 * @procedure spNoteColorStats
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/note/stats/by-color
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @testScenarios
 * - Get stats for an account with notes
 * - Get stats for an account with no notes
 * - Security validation with invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteColorStats]
  @idAccount INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @rule {db-note-color-stats} Calculate note count for each color
   */
  /**
   * @output {ColorStats, n, n}
   * @column {INT} idColor
   * - Description: Color identifier
   * @column {NVARCHAR(50)} name
   * - Description: Color name
   * @column {VARCHAR(7)} hexCode
   * - Description: Color hex code
   * @column {INT} noteCount
   * - Description: Number of notes with this color
   */
  SELECT
    [clr].[idColor],
    [clr].[name],
    [clr].[hexCode],
    COUNT([nte].[idNote]) AS [noteCount]
  FROM [config].[color] [clr]
    LEFT JOIN [functional].[note] [nte] ON ([nte].[idColor] = [clr].[idColor] AND [nte].[idAccount] = @idAccount)
  GROUP BY
    [clr].[idColor],
    [clr].[name],
    [clr].[hexCode]
  ORDER BY
    [clr].[idColor];
END;
GO


-- File: functional/note/spNoteCreate.sql
/**
 * @summary
 * Creates a new note with titulo, conteudo, and optional idColor.
 * Automatically generates dateCreated and dateModified timestamps.
 *
 * @procedure spNoteCreate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - POST /api/v1/internal/note
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit purposes
 *
 * @param {NVARCHAR(100)} titulo
 *   - Required: Yes
 *   - Description: Note title (3-100 characters)
 *
 * @param {NVARCHAR(MAX)} conteudo
 *   - Required: Yes
 *   - Description: Note content (1-5000 characters)
 *
 * @param {INT} idColor
 *   - Required: No
 *   - Description: Note color identifier (default: 1 for 'Neutro')
 *
 * @returns {INT} idNote - Identifier of the created note
 *
 * @testScenarios
 * - Valid creation with all required parameters
 * - Valid creation with optional idColor parameter
 * - Validation failure for titulo length constraints
 * - Validation failure for conteudo length constraints
 * - Security validation with invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @titulo NVARCHAR(100),
  @conteudo NVARCHAR(MAX),
  @idColor INTEGER = 1
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {tituloRequired}
   */
  IF @titulo IS NULL OR LEN(@titulo) = 0
  BEGIN
    ;THROW 51000, 'tituloRequired', 1;
  END;

  /**
   * @validation Titulo length validation
   * @throw {tituloTooShort}
   */
  IF LEN(@titulo) < 3
  BEGIN
    ;THROW 51000, 'tituloTooShort', 1;
  END;

  /**
   * @validation Titulo length validation
   * @throw {tituloTooLong}
   */
  IF LEN(@titulo) > 100
  BEGIN
    ;THROW 51000, 'tituloTooLong', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {conteudoRequired}
   */
  IF @conteudo IS NULL OR LEN(@conteudo) = 0
  BEGIN
    ;THROW 51000, 'conteudoRequired', 1;
  END;

  /**
   * @validation Conteudo length validation
   * @throw {conteudoTooLong}
   */
  IF LEN(@conteudo) > 5000
  BEGIN
    ;THROW 51000, 'conteudoTooLong', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation Color existence validation
   * @throw {colorDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [config].[color] clr WHERE clr.[idColor] = @idColor)
  BEGIN
    ;THROW 51000, 'colorDoesntExist', 1;
  END;

  DECLARE @idNote INTEGER;
  DECLARE @currentDateTime DATETIME2 = GETUTCDATE();

  BEGIN TRY
    /**
     * @rule {db-note-creation} Insert new note with validated parameters
     */
    BEGIN TRAN;

      INSERT INTO [functional].[note]
      ([idAccount], [idColor], [titulo], [conteudo], [dateCreated], [dateModified])
      VALUES
      (@idAccount, @idColor, @titulo, @conteudo, @currentDateTime, @currentDateTime);

      SET @idNote = SCOPE_IDENTITY();

      /**
       * @output {NoteCreated, 1, 1}
       * @column {INT} idNote
       * - Description: Identifier of the created note
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO


-- File: functional/note/spNoteDelete.sql
/**
 * @summary
 * Permanently deletes a note from the database after validation.
 * This is a hard delete operation that cannot be undone.
 *
 * @procedure spNoteDelete
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - DELETE /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit purposes
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier to delete
 *
 * @testScenarios
 * - Valid deletion with existing note
 * - Validation failure for non-existent note
 * - Security validation with mismatched account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteDelete]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idNote INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idNoteRequired}
   */
  IF @idNote IS NULL
  BEGIN
    ;THROW 51000, 'idNoteRequired', 1;
  END;

  /**
   * @validation Note existence and account ownership validation
   * @throw {noteDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[note] nte WHERE nte.[idNote] = @idNote AND nte.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'noteDoesntExist', 1;
  END;

  BEGIN TRY
    /**
     * @rule {db-note-deletion} Permanently delete note from database
     */
    BEGIN TRAN;

      DELETE FROM [functional].[note]
      WHERE [idNote] = @idNote
        AND [idAccount] = @idAccount;

      /**
       * @output {NoteDeleted, 1, 1}
       * @column {INT} idNote
       * - Description: Identifier of the deleted note
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

-- File: functional/note/spNoteGet.sql
/**
 * @summary
 * Retrieves a specific note by its identifier with account validation,
 * including details of its assigned color.
 *
 * @procedure spNoteGet
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier
 *
 * @testScenarios
 * - Retrieve existing note with valid parameters
 * - Validation failure for non-existent note
 * - Security validation with mismatched account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteGet]
  @idAccount INTEGER,
  @idNote INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idNoteRequired}
   */
  IF @idNote IS NULL
  BEGIN
    ;THROW 51000, 'idNoteRequired', 1;
  END;

  /**
   * @validation Note existence and account ownership validation
   * @throw {noteDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[note] nte WHERE nte.[idNote] = @idNote AND nte.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'noteDoesntExist', 1;
  END;

  /**
   * @rule {db-note-retrieval} Retrieve specific note details with color information
   */
  /**
   * @output {NoteDetails, 1, n}
   * @column {INT} idNote
   * - Description: Note identifier
   * @column {NVARCHAR(100)} titulo
   * - Description: Note title
   * @column {NVARCHAR(MAX)} conteudo
   * - Description: Note content
   * @column {INT} idColor
   * - Description: Color identifier
   * @column {NVARCHAR(50)} colorName
   * - Description: Color name
   * @column {VARCHAR(7)} colorHex
   * - Description: Color hex code
   * @column {DATETIME2} dateCreated
   * - Description: Note creation timestamp
   * @column {DATETIME2} dateModified
   * - Description: Note last modification timestamp
   */
  SELECT
    [nte].[idNote],
    [nte].[titulo],
    [nte].[conteudo],
    [nte].[idColor],
    [clr].[name] AS [colorName],
    [clr].[hexCode] AS [colorHex],
    [nte].[dateCreated],
    [nte].[dateModified]
  FROM [functional].[note] [nte]
    JOIN [config].[color] [clr] ON ([clr].[idColor] = [nte].[idColor])
  WHERE [nte].[idNote] = @idNote
    AND [nte].[idAccount] = @idAccount;
END;
GO


-- File: functional/note/spNoteList.sql
/**
 * @summary
 * Lists all notes for an account with optional filtering by multiple colors
 * and sorting by different criteria (dateCreated, dateModified, titulo).
 *
 * @procedure spNoteList
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - GET /api/v1/internal/note
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {VARCHAR(MAX)} filterColorIds
 *   - Required: No
 *   - Description: Filter notes by a comma-separated list of color IDs ('todas' for all colors)
 *
 * @param {VARCHAR(50)} orderBy
 *   - Required: No
 *   - Description: Sort field (dateCreated, dateModified, titulo)
 *
 * @param {VARCHAR(4)} direction
 *   - Required: No
 *   - Description: Sort direction (asc or desc)
 *
 * @testScenarios
 * - List all notes with default sorting
 * - List notes filtered by a single color ID
 * - List notes filtered by multiple color IDs
 * - List notes sorted by titulo ascending
 * - List notes sorted by dateCreated descending
 * - Security validation with invalid account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteList]
  @idAccount INTEGER,
  @filterColorIds VARCHAR(MAX) = 'todas',
  @orderBy VARCHAR(50) = 'dateModified',
  @direction VARCHAR(4) = 'desc'
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Account existence validation
   * @throw {accountDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [subscription].[account] acc WHERE acc.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'accountDoesntExist', 1;
  END;

  /**
   * @validation OrderBy parameter validation
   * @throw {invalidOrderByParameter}
   */
  IF @orderBy NOT IN ('dateCreated', 'dateModified', 'titulo')
  BEGIN
    ;THROW 51000, 'invalidOrderByParameter', 1;
  END;

  /**
   * @validation Direction parameter validation
   * @throw {invalidDirectionParameter}
   */
  IF @direction NOT IN ('asc', 'desc')
  BEGIN
    ;THROW 51000, 'invalidDirectionParameter', 1;
  END;

  /**
   * @rule {db-note-listing} Retrieve notes with filtering and sorting
   */
  /**
   * @output {NoteList, n, n}
   * @column {INT} idNote
   * - Description: Note identifier
   * @column {NVARCHAR(100)} titulo
   * - Description: Note title
   * @column {NVARCHAR(MAX)} conteudo
   * - Description: Note content
   * @column {INT} idColor
   * - Description: Color identifier
   * @column {NVARCHAR(50)} colorName
   * - Description: Color name
   * @column {VARCHAR(7)} colorHex
   * - Description: Color hex code
   * @column {DATETIME2} dateCreated
   * - Description: Note creation timestamp
   * @column {DATETIME2} dateModified
   * - Description: Note last modification timestamp
   */
  SELECT
    [nte].[idNote],
    [nte].[titulo],
    [nte].[conteudo],
    [nte].[idColor],
    [clr].[name] AS [colorName],
    [clr].[hexCode] AS [colorHex],
    [nte].[dateCreated],
    [nte].[dateModified]
  FROM [functional].[note] [nte]
    JOIN [config].[color] [clr] ON ([clr].[idColor] = [nte].[idColor])
  WHERE [nte].[idAccount] = @idAccount
    AND (@filterColorIds = 'todas' OR [nte].[idColor] IN (SELECT value FROM STRING_SPLIT(@filterColorIds, ',')))
  ORDER BY
    CASE WHEN @orderBy = 'dateModified' AND @direction = 'desc' THEN [nte].[dateModified] END DESC,
    CASE WHEN @orderBy = 'dateModified' AND @direction = 'asc' THEN [nte].[dateModified] END ASC,
    CASE WHEN @orderBy = 'dateCreated' AND @direction = 'desc' THEN [nte].[dateCreated] END DESC,
    CASE WHEN @orderBy = 'dateCreated' AND @direction = 'asc' THEN [nte].[dateCreated] END ASC,
    CASE WHEN @orderBy = 'titulo' AND @direction = 'desc' THEN [nte].[titulo] END DESC,
    CASE WHEN @orderBy = 'titulo' AND @direction = 'asc' THEN [nte].[titulo] END ASC;
END;
GO


-- File: functional/note/spNoteUpdate.sql
/**
 * @summary
 * Updates an existing note's titulo, conteudo, and idColor.
 * Automatically updates dateModified timestamp.
 *
 * @procedure spNoteUpdate
 * @schema functional
 * @type stored-procedure
 *
 * @endpoints
 * - PUT /api/v1/internal/note/:id
 *
 * @parameters
 * @param {INT} idAccount
 *   - Required: Yes
 *   - Description: Account identifier for multi-tenancy isolation
 *
 * @param {INT} idUser
 *   - Required: Yes
 *   - Description: User identifier for audit purposes
 *
 * @param {INT} idNote
 *   - Required: Yes
 *   - Description: Note identifier to update
 *
 * @param {NVARCHAR(100)} titulo
 *   - Required: Yes
 *   - Description: Updated note title (3-100 characters)
 *
 * @param {NVARCHAR(MAX)} conteudo
 *   - Required: Yes
 *   - Description: Updated note content (1-5000 characters)
 *
 * @param {INT} idColor
 *   - Required: Yes
 *   - Description: Updated note color identifier
 *
 * @testScenarios
 * - Valid update with all parameters
 * - Validation failure for titulo length constraints
 * - Validation failure for conteudo length constraints
 * - Validation failure for non-existent note
 * - Security validation with mismatched account
 */
CREATE OR ALTER PROCEDURE [functional].[spNoteUpdate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idNote INTEGER,
  @titulo NVARCHAR(100),
  @conteudo NVARCHAR(MAX),
  @idColor INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {idAccountRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idUserRequired}
   */
  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {idNoteRequired}
   */
  IF @idNote IS NULL
  BEGIN
    ;THROW 51000, 'idNoteRequired', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {tituloRequired}
   */
  IF @titulo IS NULL OR LEN(@titulo) = 0
  BEGIN
    ;THROW 51000, 'tituloRequired', 1;
  END;

  /**
   * @validation Titulo length validation
   * @throw {tituloTooShort}
   */
  IF LEN(@titulo) < 3
  BEGIN
    ;THROW 51000, 'tituloTooShort', 1;
  END;

  /**
   * @validation Titulo length validation
   * @throw {tituloTooLong}
   */
  IF LEN(@titulo) > 100
  BEGIN
    ;THROW 51000, 'tituloTooLong', 1;
  END;

  /**
   * @validation Required parameter validation
   * @throw {conteudoRequired}
   */
  IF @conteudo IS NULL OR LEN(@conteudo) = 0
  BEGIN
    ;THROW 51000, 'conteudoRequired', 1;
  END;

  /**
   * @validation Conteudo length validation
   * @throw {conteudoTooLong}
   */
  IF LEN(@conteudo) > 5000
  BEGIN
    ;THROW 51000, 'conteudoTooLong', 1;
  END;

  /**
   * @validation Note existence and account ownership validation
   * @throw {noteDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [functional].[note] nte WHERE nte.[idNote] = @idNote AND nte.[idAccount] = @idAccount)
  BEGIN
    ;THROW 51000, 'noteDoesntExist', 1;
  END;

  /**
   * @validation Color existence validation
   * @throw {colorDoesntExist}
   */
  IF NOT EXISTS (SELECT * FROM [config].[color] clr WHERE clr.[idColor] = @idColor)
  BEGIN
    ;THROW 51000, 'colorDoesntExist', 1;
  END;

  DECLARE @currentDateTime DATETIME2 = GETUTCDATE();

  BEGIN TRY
    /**
     * @rule {db-note-update} Update note with validated parameters
     */
    BEGIN TRAN;

      UPDATE [functional].[note]
      SET
        [titulo] = @titulo,
        [conteudo] = @conteudo,
        [idColor] = @idColor,
        [dateModified] = @currentDateTime
      WHERE [idNote] = @idNote
        AND [idAccount] = @idAccount;

      /**
       * @output {NoteUpdated, 1, 1}
       * @column {INT} idNote
       * - Description: Identifier of the updated note
       */
      SELECT @idNote AS [idNote];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO



-- ============================================
-- Migration completed successfully
-- ============================================

PRINT 'Migration completed successfully!';
GO
